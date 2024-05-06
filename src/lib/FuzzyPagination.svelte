<script>
  import {fuzzy} from "./store.js";
  import {ArrowLeft, ArrowRight} from "./icons/index.js"

  export let position = 'top'

  $fuzzy.pages = Array.from({ length: Math.ceil($fuzzy.table.length / $fuzzy.size) }, (_, i) => i)


  $: displayPages = () => {
    const sidePages = 3;
    const totalPages = $fuzzy.pages.length;
    let start = Math.max($fuzzy.current_page - sidePages, 0);
    let end = Math.min($fuzzy.current_page + sidePages, totalPages - 1);

    let pages = [];

    if (start > 1) {
      pages.push(0);
      if (start > 2) pages.push('...');
    }

    pages.push(...$fuzzy.pages.slice(start, end + 1));

    if (end < totalPages - 2) {
      if (end < totalPages - 3) pages.push('...');
      pages.push(totalPages - 1);
    }

    return pages;
  };

</script>

{#if position == 'bottom' && displayPages()}
  <nav aria-label="Pagination" id="fuzzy_pagination_bottom" class="isolate inline-flex rounded-md shadow-sm mx-auto">

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
  <span id="fuzzy_pagination_top" class="isolate inline-flex rounded-md shadow-sm mx-auto">
    {#if $fuzzy.pages.includes($fuzzy.current_page - 1)}
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
      class={`relative inline-flex items-center bg-white dark:bg-stone-800 dark:text-stone-200 px-4 py-2 text-stone-600 border ${$fuzzy.pages.includes($fuzzy.current_page - 1) ? 'border-x-0' : ''} border-stone-400 dark:border-stone-950 hover:bg-stone-50 hover:dark:bg-stone-950 focus:z-10`}
      >{$fuzzy.current_page + 1}</button
    >
    {#if $fuzzy.pages.includes($fuzzy.current_page + 1) }
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
  </span>
{/if}

{/if}