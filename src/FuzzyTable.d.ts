export interface Column {
  name: string;
  id: string;
  type?: string;
  subtitle?: string;
  searchable?: boolean;
  suffix?: string;
  hideZeros?: boolean;
  icon?: { id: string; base: string; class?: string };
  img?: { id: string; base: string; ext?: string; class?: string };
  class?: string;
  sortDir?: 'ascending' | 'descending';
  sortEmptyLast?: boolean;
  link?: {
    id: string;
    base?: string;
    target?: string;
    data?: Record<string, string>;
  };
}

export interface FilterOption {
  title: string;
  value: RegExp;
  inverse?: boolean;
  active?: boolean;
  code?: string;
}

export interface Filter {
  name: string;
  filterColumn: string;
  filterType: 'checkbox' | 'radio';
  icon?: { base: string; class?: string };
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
  matchHighlight?: string;
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
  similarityThreshold?: number;
  exactMatchBonus?: number;
  highlightMatches?: boolean;
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
    containerId: string | HTMLElement,
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
  destroy(): void;
  safeHtml(html: string): Node | null;
  paginationUpdate(): void;
  updateTable(): void;
}
