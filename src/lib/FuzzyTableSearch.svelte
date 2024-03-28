<script>
    import {fuzzy, fuse} from "./store.js";

    export let t;

    let instantSearch = function () {
        if ($fuzzy.query != "") {
            let results = $fuse.search($fuzzy.query).slice(0, 100);
            results.map((item) => {
                item = highlighter(item);
            });
            $fuzzy.table = results;
        } else {
            $fuzzy.table = $fuzzy.filteredTable;
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
    bind:value={$fuzzy.query}
    on:input={instantSearch}
    aria-label="Search"
    autocomplete="off"
    class={`
        ${($fuzzy.size < $fuzzy.table.length) ? 'border-r-0' : 'border-r-1 rounded-r-lg'}
        block w-full border border-l-0 border-stone-400 dark:border-stone-950 px-4 text-sm shadow-lg 
        dark:bg-stone-800 text-stone-800 dark:text-stone-100 
        placeholder-stone-800 dark:placeholder-stone-100
    `}
/>
