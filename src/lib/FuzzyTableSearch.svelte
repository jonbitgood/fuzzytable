<script>
    import Fuse from "fuse.js";
    import fuzzy from "./store.js";

    export let data;
    export let head;
    export let t;

    $fuzzy.table = data;

    let query;
    const engine = new Fuse(data, {
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3, // At what point does the match algorithm give up. A threshold of 0.0 requires a perfect match (of both letters and location), a threshold of 1.0 would match anything.
        location: 0, // Determines approximately where in the text is the pattern expected to be found
        distance: 50, // Determines how close the match must be to the fuzzy location (specified by location). An exact letter match which is distance characters away from the fuzzy location would score as a complete mismatch. A distance of 0 requires the match be at the exact location specified. A distance of 1000 would require a perfect match to be within 800 characters of the location to be found using a threshold of 0.8
        maxPatternLength: 12,
        minMatchCharLength: 1,
        keys: head
            .filter((column) => column.searchable !== false)
            .map((column) => column.id),
    });

    let instantSearch = function () {
        if (query != "") {
            let results = engine.search(query).slice(0, 100);
            results.map((item) => {
                item = highlighter(item);
            });
            $fuzzy.table = results;
        } else {
            $fuzzy.table = data;
        }
    };

    let highlighter = function (resultItem) {
        resultItem.matches.forEach((matchItem) => {
            let text = resultItem.item[matchItem.key];
            let result = [];
            let matches = [].concat(matchItem.indices);
            let pair = matches.shift();

            for (let i = 0; i < text.length; i++) {
                let char = text.charAt(i);
                if (pair && i == pair[0]) {
                    result.push("<b>");
                }
                result.push(char);
                if (pair && i == pair[1]) {
                    result.push("</b>");
                    pair = matches.shift();
                }
            }
            resultItem.highlight = result.join("");
            resultItem.highlight_key = matchItem.key;

            if (resultItem.children && resultItem.children.length > 0) {
                resultItem.children.forEach((child) => {
                    highlighter(child);
                });
            }
        });
    };
</script>

<input
    type="search"
    placeholder={t?.search ?? "Type Anything ..."}
    bind:value={query}
    on:input={instantSearch}
    aria-label="Search"
    autocomplete="off"
    class="block w-full border border-x-0 border-stone-400 pl-10 text-sm text-stone-800 shadow-lg placeholder-stone-800 dark:border-stone-700 dark:bg-stone-600 dark:text-stone-100 dark:placeholder-stone-100"
/>
