<script>
    import { fuzzy } from './store.js';

    $: startIndex = $fuzzy.current_page * $fuzzy.size;
    $: endIndex = Math.min((startIndex + $fuzzy.size), $fuzzy.data.length);
</script>

<div id="fuzzy_table_info" class="counter text-center text-sm text-stone-400 dark:text-stone-200 py-4">
    {startIndex + 1} - {endIndex} / {$fuzzy.data.length}
</div>