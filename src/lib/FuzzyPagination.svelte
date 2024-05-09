<script>
  import { fuzzy, pages } from "./store.js";
  import { ArrowLeft, ArrowRight } from "./icons/index.js";

  export let position = 'top';

  $: sidePages = 3;
  $: totalPages = $pages.length; // Ensuring direct usage of $pages
  $: currentPage = $fuzzy.current_page;

  $: displayPages = () => {
    if (totalPages < sidePages) {
      sidePages = totalPages;
    }
    let start = Math.max(currentPage - sidePages, 0);
    let end = Math.min(currentPage + sidePages, totalPages - 1);

    let pagesArray = [];

    if (start > 1) {
      pagesArray.push(0);
      if (start > 2) pagesArray.push('...');
    }

    pagesArray.push(...$pages.slice(start, end + 1)); // Direct use of $pages

    if (end < totalPages - 2) {
      if (end < totalPages - 3) pagesArray.push('...');
      pagesArray.push(totalPages - 1);
    }

    return pagesArray;
  };
</script>

{#if position == 'bottom' && displayPages()}
  <nav aria-label="Pagination" id="fuzzy_pagination_bottom" class="inline-flex rounded-md shadow-sm mx-auto mt-4">

      {#each displayPages() as page}
        {#if page === '...'}
          <span class="relative inline-flex items-center bg-white dark:bg-stone-800 dark:text-stone-200 px-2 py-1 text-stone-600 border border-stone-400 dark:border-stone-950 hover:bg-stone-5 hover:dark:bg-stone-950 focus:z-10">
            {page}
          </span>
        {:else}

            <button
            class={`${$fuzzy.current_page === page ? '' : 'opacity-60'} relative inline-flex items-center bg-white dark:bg-stone-800 dark:text-stone-200 px-2 py-1 text-stone-600 border border-stone-400 dark:border-stone-950 hover:bg-stone-5 hover:dark:bg-stone-950 focus:z-10`}
              on:click={() => {
                $fuzzy.current_page = page;
                $fuzzy.start = $fuzzy.current_page * $fuzzy.size;
              }}
            >{page + 1}</button>

        {/if}
      {/each}
  </nav>
{/if}


{#if position == 'top'}

{#if $fuzzy.size < $fuzzy.table.length}

  <div id="fuzzy_pagination_top" class="isolate inline-flex rounded-md shadow-sm mx-auto">
    {#if $pages.includes($fuzzy.current_page - 1)}
      <button
        type="button"
        class={`relative inline-flex items-center ${ position == 'top' ? '' : 'ltr:rounded-l-md rtl:rounded-r-md'} bg-white dark:bg-stone-800 dark:text-stone-200 px-2 py-1 text-stone-600 border border-stone-400 dark:border-stone-950 hover:bg-stone-5 hover:dark:bg-stone-950 focus:z-10`}
        on:click={() => {
          $fuzzy.current_page--;
          $fuzzy.start = $fuzzy.current_page * $fuzzy.size;
        }}
      >
        <span class="sr-only">Previous</span>
        <span class="rtl:hidden"><ArrowLeft /></span>
        <span class="hidden rtl:block"><ArrowRight /></span>
      </button>
    {/if}
    <button
      class={`relative inline-flex items-center bg-white dark:bg-stone-800 dark:text-stone-200 px-4 py-2 text-stone-600 border border-l-0 border-stone-400 dark:border-stone-950 hover:bg-stone-50 hover:dark:bg-stone-950 focus:z-10`}
      >{$fuzzy.current_page + 1}</button
    >
    {#if $pages.includes($fuzzy.current_page + 1) }
      <button
        type="button"
        class="relative -ml-px inline-flex items-center ltr:rounded-r-md rtl:rounded-l-md bg-white dark:bg-stone-800 dark:text-stone-200 px-2 py-1 text-stone-600 border border-stone-400 dark:border-stone-950 hover:bg-stone-50 hover:dark:bg-stone-950 focus:z-10"
        on:click={() => {
          $fuzzy.current_page++;
          $fuzzy.start = $fuzzy.current_page * $fuzzy.size;
        }}
      >
        <span class="sr-only">Next</span>
        <span class="rtl:hidden"><ArrowRight /></span>
        <span class="hidden rtl:block"><ArrowLeft /></span>
      </button>
    {/if}
  </div>

{/if}

{/if}