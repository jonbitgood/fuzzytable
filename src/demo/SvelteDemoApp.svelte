<script>
  import FuzzyTable from '../FuzzyTable.svelte';
  import { onMount } from 'svelte';

  let data = $state([]);
  let allData = [];

  const head = [
    { id: "name", name: "<b>Script</b>", subtitle: "script", sortDir: "ascending", link: { base: `https://find.bible/en/alphabets/`, id: 'script' } },
    { id: "family", name: "Family", link: { base: `https://find.bible/en/countries/`, id: 'id' }, searchable: false, class: "text-center hidden lg:table-cell" },
    { id: "diacritics", name: "Diacritics", type:"bool", searchable: false, class: "text-right hidden lg:table-cell" },
  ];

  const options = {
    t: {search_placeholder: 'Search'},
    locale: 'en',
    aside: '<div class="max-w-sm bg-stone-700 border-stone-900 border-2 text-stone-200 text-sm mt-8 mx-2 p-2 rounded-lg">An <b>alphabet</b> is a standard set of letters written to represent particular sounds in a spoken language. This Svelte 5 demo shows reactive data updates using Svelte\'s new runes system ($state, $derived, $effect).</div>'
  };

  onMount(() => {
    fetch('alphabets.json')
      .then(reply => reply.json())
      .then(loadedData => {
        allData = loadedData;
        data = loadedData;
      });
  });

  function filterLatin() {
    data = allData.filter(item =>
      item.family && item.family.toLowerCase().includes('latin')
    );
  }

  function filterAsian() {
    data = allData.filter(item =>
      item.family && (
        item.family.toLowerCase().includes('chinese') ||
        item.family.toLowerCase().includes('japanese') ||
        item.family.toLowerCase().includes('korean')
      )
    );
  }

  function showAll() {
    data = allData;
  }

  function addCustom() {
    const customEntry = {
      name: 'Custom Script',
      script: 'custom',
      family: 'Custom Family',
      diacritics: true
    };
    data = [customEntry, ...data];
  }
</script>

<div class="demo-controls">
  <h2 style="margin-bottom: 1rem;">Svelte 5 Reactivity Demo</h2>
  <p style="margin-bottom: 0.5rem; opacity: 0.8;">This demo shows the Svelte 5 component with reactive data updates:</p>
  <button onclick={filterLatin}>Filter Latin Scripts</button>
  <button onclick={filterAsian}>Filter Asian Scripts</button>
  <button onclick={showAll}>Show All</button>
  <button onclick={addCustom}>Add Custom Entry</button>
</div>

{#if data.length > 0}
  <FuzzyTable {data} {head} {options} />
{/if}

<style>
  .demo-controls {
    max-width: 80rem;
    margin: 1rem auto;
    padding: 1rem;
    background: #1c1917;
    border-radius: 0.5rem;
    color: white;
  }

  .demo-controls button {
    background: #0891b2;
    color: white;
    padding: 0.5rem 1rem;
    margin: 0.25rem;
    border-radius: 0.25rem;
    border: none;
    cursor: pointer;
  }

  .demo-controls button:hover {
    background: #0e7490;
  }
</style>
