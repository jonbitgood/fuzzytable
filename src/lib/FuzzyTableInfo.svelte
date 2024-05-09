<script>
    import { fuzzy } from './store.js';

    /**
     * The starting index of the currently visible items in the fuzzy table,
     * calculated based on the current page and the number of items per page.
     * @type {number}
     */
    $: startIndex = $fuzzy.current_page * $fuzzy.size;

    /**
     * The ending index of the currently visible items in the fuzzy table,
     * calculated as the minimum of the start index plus the size or the length of the data.
     * This ensures the index does not exceed the bounds of the data array.
     * @type {number}
     */
    $: endIndex = Math.min((startIndex + $fuzzy.size), $fuzzy.data.length);
</script>

<div id="fuzzy_table_info" class="counter text-center text-sm text-stone-400 dark:text-stone-200 py-4">
    {startIndex + 1} - {endIndex} / {$fuzzy.table.length} {$fuzzy.table.length < $fuzzy.data.length ? ' ∈ ' + $fuzzy.data.length : ''}
</div>
