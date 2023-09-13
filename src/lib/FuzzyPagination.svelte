<script>
  import fuzzy from "./store.js";

  export let position

  $fuzzy.pages = Array.from({ length: $fuzzy.table.length / $fuzzy.size }, (_, i) => i)
</script>

{#if $fuzzy.size < $fuzzy.table.length}
  <span class="isolate inline-flex rounded-md shadow-sm mx-auto">
    {#if $fuzzy.pages.includes($fuzzy.current_page - 1)}
      <button
        type="button"
        class={`relative inline-flex items-center ${ position == 'top' ? '' : 'rounded-l-md'} bg-white dark:bg-stone-900 px-2 py-1 text-stone-600 border border-stone-400 hover:bg-stone-50 focus:z-10`}
        on:click={() => {
          $fuzzy.current_page--;
          $fuzzy.start = $fuzzy.current_page * $fuzzy.size;
        }}
      >
        <span class="sr-only">Previous</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    {/if}
    <button
      class={`relative inline-flex items-center bg-white dark:bg-stone-900 px-4 py-2 text-stone-600 border ${$fuzzy.pages.includes($fuzzy.current_page - 1) ? 'border-x-0' : ''} border-stone-400 dark:border-stone-950 hover:bg-stone-50 focus:z-10`}
      >{$fuzzy.current_page + 1}</button
    >
    {#if $fuzzy.pages.includes($fuzzy.current_page + 1) }
      <button
        type="button"
        class="relative -ml-px inline-flex items-center rounded-r-md bg-white dark:bg-stone-900 px-2 py-1 text-stone-600 ring-1 ring-inset ring-stone-400 dark:ring-stone-950 hover:bg-stone-50 focus:z-10"
        on:click={() => {
          $fuzzy.current_page++;
          $fuzzy.start = $fuzzy.current_page * $fuzzy.size;
        }}
      >
        <span class="sr-only">Next</span>
        <svg
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    {/if}
  </span>
{/if}
