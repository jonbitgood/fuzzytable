// Use code points for supplementary characters, and keep the common BMP path allocation-free.
const characters = text => /[\uD800-\uDBFF]/.test(text) ? Array.from(text) : text;

// Lowercasing can expand a character (e.g. İ). Map UTF-16 ranges back to display text.
function sourceRanges(text, folded, ranges) {
    if (text.length === folded.length || !ranges.length) return ranges;
    const result = [];
    let source = 0;
    let offset = 0;
    let i = 0;
    for (const char of text) {
        const next = offset + char.toLowerCase().length;
        const [start, end] = ranges[i];
        if (start < next && end > offset) {
            const last = result[result.length - 1];
            if (last && last[1] === source) last[1] += char.length;
            else result.push([source, source + char.length]);
        }
        source += char.length;
        offset = next;
        while (i < ranges.length && ranges[i][1] <= offset) i++;
        if (i === ranges.length) break;
    }
    return result;
}

export function createMatcher(term, { similarityThreshold = 0.9, exactMatchBonus = 0.5 } = {}) {
    const query = term.trim().toLowerCase();
    if (!query) return null;
    const queryChars = characters(query);
    const phrase = /\s/.test(query);
    const wordScores = new Map();
    const used = new Uint8Array(queryChars.length);
    const matched = new Uint32Array(queryChars.length);

    function jaroWinkler(candidate, ranges, offset = 0) {
        const left = characters(candidate);
        const shorter = Math.min(left.length, queryChars.length);
        if (!shorter) return 0;

        let prefix = 0;
        while (prefix < Math.min(4, shorter) && left[prefix] === queryChars[prefix]) prefix++;

        // Even matching every character in the shorter string cannot beat this bound.
        const upper = (shorter / left.length + shorter / queryChars.length + 1) / 3;
        if (upper + prefix * 0.1 * (1 - upper) < similarityThreshold) return 0;

        const window = Math.max(0, Math.floor(Math.max(left.length, queryChars.length) / 2) - 1);
        used.fill(0);
        let count = 0;
        for (let i = 0; i < left.length; i++) {
            const end = Math.min(i + window + 1, queryChars.length);
            for (let j = Math.max(0, i - window); j < end; j++) {
                if (!used[j] && left[i] === queryChars[j]) {
                    used[j] = 1;
                    matched[count++] = j;
                    if (ranges) {
                        const end = offset + left[i].length;
                        const last = ranges[ranges.length - 1];
                        if (last && last[1] === offset) last[1] = end;
                        else ranges.push([offset, end]);
                    }
                    break;
                }
            }
            if (ranges) offset += left[i].length;
        }
        if (!count) return 0;

        // Compare the matched sequences in each string's own order.
        let differences = 0;
        let k = 0;
        for (let j = 0; j < used.length; j++) {
            if (used[j] && queryChars[matched[k++]] !== queryChars[j]) differences++;
        }
        const order = 1 - differences / (2 * count);
        const jaro = (count / left.length + count / queryChars.length + order) / 3;
        return jaro >= 0.7 ? jaro + prefix * 0.1 * (1 - jaro) : jaro;
    }

    function fuzzyScore(word) {
        let score = wordScores.get(word);
        if (score === undefined) {
            score = jaroWinkler(word);
            wordScores.set(word, score);
        }
        return score;
    }

    function literalScore(text, offset) {
        return 0.8 + 0.1 * (1 - offset / text.length)
            + 0.1 * (query.length / text.length) + exactMatchBonus;
    }

    function highlightWord(word, ranges, offset) {
        const score = fuzzyScore(word);
        if (score > 0 && score >= similarityThreshold) {
            jaroWinkler(word, ranges, offset);
        }
    }

    return {
        threshold: similarityThreshold,
        maxScore: Math.max(1, 1 + exactMatchBonus),
        scoreField({ text, words }) {
            const offset = text.indexOf(query);
            if (offset >= 0) return literalScore(text, offset);
            if (phrase || !words) return fuzzyScore(text);
            let best = 0;
            for (const word of words) best = Math.max(best, fuzzyScore(word));
            return best;
        },
        ranges(value) {
            const text = String(value);
            const folded = text.toLowerCase();
            const ranges = [];
            let offset = folded.indexOf(query);
            if (offset >= 0) {
                if (literalScore(folded, offset) < similarityThreshold) return ranges;
                while (offset >= 0) {
                    ranges.push([offset, offset + query.length]);
                    offset = folded.indexOf(query, offset + query.length);
                }
            } else if (phrase) {
                highlightWord(folded, ranges, 0);
            } else {
                for (const word of folded.matchAll(/\S+/g)) {
                    highlightWord(word[0], ranges, word.index);
                }
            }
            return sourceRanges(text, folded, ranges);
        }
    };
}
