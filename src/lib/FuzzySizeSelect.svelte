<script>
import { fuzzy } from "./store.js";
</script>

<div class="relative inline-block">
  <select
    id="fuzzy_size_select"
    bind:value={$fuzzy.size}
    class="appearance-none h-full pr-5 bg-white dark:bg-stone-800 dark:text-stone-300 text-center ring-1 ring-inset ring-stone-400 dark:ring-stone-950"
  >
    {#each $fuzzy.page_sizes as pageSize}
      <option value={pageSize} selected={pageSize == $fuzzy.size}>
        {pageSize}
      </option>
    {/each}
  </select>

<svg class="absolute w-3 h-3 right-2 top-1/2 -translate-y-1/2 pointer-events-none dark:text-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
</svg>

</div>
