<script>

import {Listbox,ListboxButton,ListboxOptions,ListboxOption} from "@rgossiaux/svelte-headlessui";
import fuzzyState from "./store.js"

let page_sizes = [50,250,500,1000,5000]

</script>

<Listbox bind:value={$fuzzyState.size} class="flex shadow-sm">
    <ListboxButton class="relative inline-flex items-center gap-x-1.5 ltr:rounded-l-md rtl:rounded-r-md bg-white dark:bg-stone-900 dark:text-stone-200 px-3 py-2 text-sm font-semibold text-stone-900 ring-1 ring-inset ring-stone-400 dark:ring-stone-950 hover:bg-stone-50 focus:z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
        {$fuzzyState.size}
    </ListboxButton>
    <ListboxOptions class="absolute z-50 mt-10 w-24 rounded-md bg-white dark:bg-stone-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      {#each page_sizes as page}
        <ListboxOption class="text-stone-700 dark:text-stone-200 block px-4 py-2 text-sm hover:bg-stone-200 cursor-pointer" value={page} on:click={() => $fuzzyState.size = page}>
          {page}
        </ListboxOption>
      {/each}
    </ListboxOptions>
</Listbox>