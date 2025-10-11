<script>
  import FuzzyTable from './FuzzyTable.js';

  let {
    data = $bindable([]),
    head = $bindable([]),
    options = {},
    containerId = 'fuzzy-table-container'
  } = $props();

  let containerElement = $state(null);
  let tableInstance = $state(null);
  let initialized = $state(false);

  let mergedOptions = $derived({
    filters: [],
    pageSize: 100,
    numberCol: false,
    pageSizes: [50, 100, 250, 1000, 5000],
    locale: 'en',
    vernacularNumerals: true,
    t: { search_placeholder: 'Search' },
    ...options
  });

  $effect(() => {
    if (containerElement && data && head && data.length > 0 && !initialized) {
      containerElement.id = containerId;
      tableInstance = new FuzzyTable(containerId, data, head, mergedOptions);
      initialized = true;
    }
  });

  $effect(() => {
    if (tableInstance && data && initialized) {
      tableInstance.setData(data);
    }
  });

  $effect(() => {
    return () => {
      if (containerElement) {
        containerElement.innerHTML = '';
      }
    };
  });

  export function setData(newData) {
    if (tableInstance) {
      tableInstance.setData(newData);
    }
  }

  export function getInstance() {
    return tableInstance;
  }
</script>

<div bind:this={containerElement}></div>
