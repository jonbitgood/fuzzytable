import type { Component } from 'svelte';
import type FuzzyTable from './FuzzyTable.js';
import type { Column, FuzzyTableOptions } from './FuzzyTable.js';

export type { Classes, Column, Filter, FilterOption, FuzzyTableOptions, Translation } from './FuzzyTable.js';

declare const FuzzyTableComponent: Component<{
  containerId?: string;
  data?: any[];
  head?: Column[];
  options?: FuzzyTableOptions;
}, {
  setData(data: any[]): void;
  getInstance(): FuzzyTable | undefined;
}, 'data' | 'head'>;

export default FuzzyTableComponent;
