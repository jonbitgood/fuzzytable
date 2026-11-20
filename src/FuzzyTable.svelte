<script>
  import { onDestroy } from 'svelte';
  import FuzzyTable from './FuzzyTable.js';

  let {
    data = $bindable([]),
    head = $bindable([]),
    options = {},
    containerId = 'fuzzy-table-container'
  } = $props();

  let containerElement = $state(null);
  let tableInstance;

  $effect(() => {
    if (!containerElement) return;
    if (tableInstance && tableInstance.head === head) {
      tableInstance.setData(data);
    } else {
      tableInstance?.destroy();
      tableInstance = new FuzzyTable(containerElement, data, head, options);
    }
  });

  onDestroy(() => tableInstance?.destroy());

  export function setData(newData) {
    if (tableInstance) {
      tableInstance.setData(newData);
    }
  }

  export function getInstance() {
    return tableInstance;
  }
</script>

<div id={containerId} bind:this={containerElement}></div>
