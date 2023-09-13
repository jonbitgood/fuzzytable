<script>
  import fuzzyState from "./store.js";

  export let pageSizes = [10, 50, 250, 500, 1000, 5000];
  
</script>

<div class="shadow-sm px-3 dark:bg-stone-800 dark:text-stone-300 ring-1 ring-stone-400 dark:ring-stone-950">
  <select
    id="fuzzySize"
    bind:value={$fuzzyState.size}
    class="h-full dark:bg-stone-800 dark:text-stone-300"
  >
    {#each pageSizes as pageSize}
      <option 
      value={pageSize}
      selected={pageSize == $fuzzyState.size}
        >{pageSize}</option
      >
    {/each}
  </select>
</div>