<script>
    import FuzzyTableRowManager from "./FuzzyTableRowManager.svelte";
    import FuzzyClipboardCopy from "./FuzzyClipboardHelper.svelte";
    import FuzzyPagination from "./FuzzyPagination.svelte";
    import FuzzySizeSelect from "./FuzzySizeSelect.svelte";
    import FuzzySearch from "./FuzzyTableSearch.svelte"
    import fuzzy from "./store.js";
    import { sortByValueString } from "./FuzzyUtils.js";
    import FuzzyDownloadTable from "./FuzzyDownloadTable.svelte";

    export let filters;
    export let data;
    export let head;
    export let t;
    export let pageSizes;

    let sortedCol = "";

    function sort(column) {
        const id = column.id;
        if (column.type == "int") {
            if (sortedCol == id) {
                $fuzzy.table = $fuzzy.table.sort((a, b) => a[id] - b[id]);
                sortedCol = "";
            } else {
                $fuzzy.table = $fuzzy.table.sort((a, b) => a[id] - b[id]).reverse();
                sortedCol = id;
            }
        } else {
            if (sortedCol.includes(id)) {
                $fuzzy.table = sortByValueString($fuzzy.table, id);
                sortedCol = "";
            } else {
                $fuzzy.table = sortByValueString($fuzzy.table, id).reverse();
                sortedCol = id;
            }
        }
    }

    let appliedFilters = [];

    function applyFilters(filterKey, optionKey) {
        let tempTable = data;
        filters[filterKey].options[optionKey].active =
            filters[filterKey].options[optionKey].values == "" ? false : true;

        if (filters[filterKey].filterType == "radio") {
            filters[filterKey].options.forEach((option, i) => {
                if (i != optionKey) {
                    filters[filterKey].options[i].active = false;
                }
            });
        }

        filters.forEach((filter) => {
            filter.options.forEach((option) => {
                if (option.active) {
                    if (option.inverse) {
                        tempTable = tempTable.filter(
                            (row) =>
                                !option.value.test(row[filter.filterColumn])
                        );
                    } else {
                        tempTable = tempTable.filter((row) =>
                            option.value.test(row[filter.filterColumn])
                        );
                    }
                }
            });
        });
        table = tempTable;
        engine.setCollection(table);
    }
</script>

<div class="w-full max-w-7xl px-4 mx-auto">

    <div class="flex flex-row mt-8 h-12">
        <FuzzyClipboardCopy />
        <FuzzyDownloadTable {data} />
        <FuzzySizeSelect />
        <FuzzySearch {data} {head} {t} />
        <FuzzyPagination {pageSizes} position="top" />

    </div>

    <div class="flex flex-row mt-8">
        {#if filters}
            <div class="flex flex-col lg:w-1/5 mr-4">
                <slot name="above_filters" />
                <div
                    class="min-w-fit flex justify-top flex-col ltr:mr-4 rtl:ml-4"
                >
                    {#each filters as filter, filterKey}
                        <div
                            class="block w-full bg-gray-200 dark:bg-stone-700 text-sm font-semibold p-3 text-stone-900 dark:text-stone-200 border-b border-stone-200 dark:border-stone-500 rounded-t-lg"
                        >
                            {filter.name}
                        </div>
                        <fieldset
                            class="mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2"
                        >
                            {#each filter.options as option, optionKey}
                                <button
                                    class={(option.active
                                        ? "bg-secondary-600 text-white border-secondary-800"
                                        : "") +
                                        " text-sm relative px-2 py-1 my-2 w-full flex items-center justify-center cursor-pointer rounded-lg border dark:bg-stone-800 border-stone-200 dark:border-stone-500 shadow-sm"}
                                    on:click={() =>
                                        applyFilters(filterKey, optionKey)}
                                >
                                    {#if filter.iconSprite}
                                        <svg
                                            class="w-5 h-5 my-1 justify-self-start"
                                            ><use
                                                href="{filter.iconSprite}{option.code}"
                                                xlink:href="#{option.code}"
                                            /></svg
                                        >
                                    {/if}
                                    <span class="flex-1">{option.title}</span>
                                </button>
                            {/each}
                        </fieldset>
                    {/each}

                    <slot name="below_filters" />
                </div>
            </div>
        {/if}

        <div class="flex flex-col w-full relative z-10">
            <table class="w-full">
                <thead
                    class="bg-stone-100 dark:bg-stone-700 border border-stone-300 border-b-stone-200 dark:border-stone-700"
                >
                    {#each head as column}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <th
                            class={`relative px-1 ltr:text-left rtl:text-right text-sm font-semibold text-stone-900 dark:text-stone-200 ${column.class}`}
                            on:click={() => sort(column)}
                        >
                            <span
                                class="relative z-20 bg-stone-100 dark:bg-stone-700 px-1"
                                >{column.name}</span
                            >
                            <button
                                tabindex="-1"
                                class="absolute ltr:right-2 rtl:left-2"
                            />
                        </th>
                    {/each}
                </thead>
                <tbody
                    class="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-800 border border-stone-500 dark:border-none"
                >
                    {#if $fuzzy.table}
                        {#each $fuzzy.table.slice($fuzzy.start, $fuzzy.start + $fuzzy.size) as row}
                            <tr>
                                {#each head as column}
                                    <td class={`${column.class} ${column.id} whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]`}>
                                        {#if column.link}
                                            <a href={`${column.link.base ? column.link.base : ""}${row?.item?.[column.link.id] ?? row[column.link.id]}`}>
                                                {#if column.icon}
                                                    <svg class="h-5 w-5 drop-shadow-md inline-block mr-1">
                                                        <use 
                                                            href={`${column.icon.base}${row?.item?.[column.icon.id] ?? row[column.icon.id]}`}
                                                            xlink:href={`#${row?.item?.[column.icon.id] ?? row[column.icon.id]}`}
                                                        />
                                                    </svg>
                                                {/if}
                                                <FuzzyTableRowManager
                                                    {row}
                                                    {column}
                                                    numberFormatterLocale={t?.translate_numeral}
                                                />
                                            </a>
                                        {:else}
                                            <FuzzyTableRowManager
                                                {row}
                                                {column}
                                                numberFormatterLocale={t?.translate_numeral}
                                            />
                                        {/if}
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>

            <div
                class="counter text-center text-sm text-stone-400 dark:text-stone-200"
            >
                {$fuzzy.size} / {$fuzzy.table.length}
            </div>
            <FuzzyPagination />
        </div>
    </div>
</div>
