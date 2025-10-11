export interface Column {
  name: string;
  key: string;
  class?: string;
  sortDir?: 'ascending' | 'descending';
  link?: {
    href: string;
    data?: string;
  };
}

export interface FilterOption {
  title: string;
  values: string | string[];
  active?: boolean;
  code?: string;
}

export interface Filter {
  name: string;
  key: string;
  filterType: 'checkbox' | 'radio';
  icon?: string;
  options: FilterOption[];
}

export interface Classes {
  tableContainer?: string;
  tableHeader?: string;
  table?: string;
  thead?: string;
  tbody?: string;
  th?: string;
  tr?: string;
  td?: string;
  arrowUp?: string;
  arrowDown?: string;
  searchInput?: string;
  searchContainer?: string;
  filterContainer?: string;
  filterButton?: string;
  filterButtonActive?: string;
  fieldset?: string;
  fieldsetWrap?: string;
  pagination?: string;
  paginationButton?: string;
  paginationButtonActive?: string;
  sizeSelector?: string;
  downloadButton?: string;
}

export interface Translation {
  search_placeholder?: string;
}

export interface FuzzyTableOptions {
  filters?: Filter[];
  pageSize?: number;
  numberCol?: boolean;
  pageSizes?: number[];
  paginationArrowButtonsDisabled?: boolean;
  classes?: Classes;
  aside?: string;
  checkMark?: string;
  xMark?: string;
  locale?: string;
  t?: Translation;
  vernacularNumerals?: boolean;
}

export default class FuzzyTable {
  constructor(
    containerId: string,
    data: any[],
    head: Column[],
    options?: FuzzyTableOptions
  );

  container: HTMLElement;
  data: any[];
  table: any[];
  head: Column[];
  filters: Filter[];
  filteredTable: any[];
  size: number;
  currentPage: number;
  numberCol: boolean;
  pageSizes: number[];
  classes: Classes;
  locale: string;
  numberFormatter: Intl.NumberFormat;
  vernacularNumerals: boolean;

  setData(newData: any[]): void;
  render(): void;
  safeHtml(html: string): Node | null;
  paginationUpdate(): void;
  updateTable(): void;
}
