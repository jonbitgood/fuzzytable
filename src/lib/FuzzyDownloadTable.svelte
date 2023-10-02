<script>
    export let data;

    let types = [
      'JSON',
      'TSV'
    ]
    
    const downloadData = (type) => {
      const blob = new Blob([
        (type == 'TSV') ? convertArray2TSV(data) : JSON.stringify(data)], 
        (type == 'TSV') ? {type: 'text/tsv'} : {type: 'application/json' }
      );

      const link = document.createElement('a');
      link.download = (type == 'TSV') ? 'data.tsv' : 'data.json';
      link.href = window.URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    function convertArray2TSV(data) {
      const headings = Object.keys(data[0]).join('\t');
      const rows = data.reduce((acc, c) => {
        return acc.concat([Object.values(c).join('\t')]);
      }, []).join('\n');
      return `${headings}\n${rows}`;
}
</script>

<details class="relative">
  <summary class="relative inline-flex items-center bg-white dark:bg-stone-800 px-2 h-12 dark:text-stone-300 ring-1 ring-inset ring-stone-400 dark:ring-stone-950 focus:z-10">
    
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>

  </summary>

  <div class="absolute right-0 z-50 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-stone-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    <p class="text-center text-xs text-stone-700 dark:text-stone-300 py-2">(Download entire table dataset)</p>

    {#each types as type}
      <button class="text-stone-700 dark:text-stone-200 block px-4 py-2 text-sm" on:click={() => downloadData(type)}>{type}</button>
    {/each}
  </div>

</details>
