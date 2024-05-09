<script>
  import { fuzzy } from "./store.js";
</script>

<div class="relative inline-block">
  <label for="fuzzy_size_select" class="sr-only">Select Page Size</label>
  <select
    id="fuzzy_size_select"
    bind:value={$fuzzy.size}
    class="appearance-none w-full h-full pr-8 bg-white dark:bg-stone-800 dark:text-stone-300 text-center ring-1 ring-inset ring-stone-400 dark:ring-stone-950"
  >
    {#each $fuzzy.page_sizes as pageSize}
      <option value={pageSize}>
        {pageSize}
      </option>
    {/each}
  </select>

  <svg class="absolute w-4 h-4 right-1 top-1/2 -translate-y-1/2 pointer-events-none dark:text-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" d="m19 9-7 7-7-7" />
  </svg>
</div>
