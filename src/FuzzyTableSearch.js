import { elem } from './FuzzyTableHelper.js';
import { createMatcher } from './FuzzyTableMatch.js';
import { paginationUpdate } from './FuzzyTablePagination.js';

/**
 * Creates a search input element for filtering table data using Jaro-Winkler similarity
 *
 * @param {Object} context - The FuzzyTable context
 * @returns {HTMLInputElement} - The created search input element
 */
export default function createSearchBox(context) {
    const label = elem('label', { className: context.classes.searchWrapper });
    const searchBox = elem('input', {
        type: 'search',
        value: context.query,
        id: 'fuzzy_search',
        placeholder: context.t?.search_placeholder ?? 'Search',
        className: context.classes.searchInput,
    });

    searchBox.oninput = () => filterAwareSearch(context);
    context.searchBox = searchBox;
    const iconContainer = elem('span', {
        className: context.classes.searchIcon,
        innerHTML: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>`
    });

    label.append(iconContainer, searchBox);
    return label;
}

export function filterAwareSearch(context) {
    context.query = context.searchBox.value.trim();
    refreshRows(context);
    context.resetSort();
    context.currentPage = 0;
    context.updateTable();
    paginationUpdate(context);
}

export function refreshRows(context) {
    context.matcher = createMatcher(context.query, context.config);
    const filters = [];
    for (const filter of context.filters) {
        for (const option of filter.options) {
            if (option.active) filters.push({ key: filter.filterColumn, option });
        }
    }

    const rows = filters.length ? context.data.filter(row => filters.every(({ key, option }) => {
        const regex = option.value;
        // Stateful regexes must start at the same position for every row.
        if (regex.global || regex.sticky) regex.lastIndex = 0;
        const match = regex.test(row[key]);
        return option.inverse ? !match : match;
    })) : context.data;

    if (context.matcher) context.table = rankRows(rows, context.matcher, context.searchIndex);
    else context.table = rows === context.data ? rows.slice() : rows;
    context.filteredTable = context.table;
}

// Share normalized fields across the dataset. Read each row's current values when searching.
export function createSearchIndex(excludedFields) {
    const dictionary = new Map();
    return {
        excludedFields,
        field(value) {
            const key = typeof value === 'object' ? String(value) : value;
            let field = dictionary.get(key);
            if (!field) {
                const text = String(key).toLowerCase();
                field = {
                    id: dictionary.size,
                    text,
                    words: /\s/.test(text) ? text.match(/\S+/g) ?? [] : null
                };
                dictionary.set(key, field);
            }
            return field;
        }
    };
}

export function rankRows(rows, matcher, index) {
    const results = [];
    const scores = [];
    for (const row of rows) {
        let best = 0;
        for (const key of Object.keys(row)) {
            const value = row[key];
            if (value == null || index.excludedFields.has(key)) continue;
            const field = index.field(value);
            const score = scores[field.id] ??= matcher.scoreField(field);
            if (score > best) best = score;
            if (best === matcher.maxScore) break;
        }
        if (best >= matcher.threshold) results.push({ row, score: best });
    }
    return results.sort((a, b) => b.score - a.score).map(result => result.row);
}
