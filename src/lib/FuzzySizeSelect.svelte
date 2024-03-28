<script>
  import {fuzzy} from "./store.js";

  export let pageSizes = [100, 150, 500, 1000, 5000];
</script>

<select
  id="fuzzySize"
  bind:value={$fuzzy.size}
  class="appearance-none h-full px-2 bg-white dark:bg-stone-800 dark:text-stone-300 text-center ring-1 ring-inset ring-stone-400 dark:ring-stone-950"
>
  {#each pageSizes as pageSize}
    <option value={pageSize} selected={pageSize == $fuzzy.size}>
      {pageSize}
    </option>
  {/each}
</select>
