import { sort } from './FuzzyTableSort.js'
import { createTbody } from './FuzzyTableBody.js'
import { mergeClasses } from './FuzzyTableStyles.js'
import { createFilters } from './FuzzyTableFilters.js'
import createSearchBox, { createSearchIndex, filterAwareSearch, refreshRows } from './FuzzyTableSearch.js'
import createDownloadUI from './FuzzyTableDownloader.js'
import CreatePagination, {paginationUpdate as pUpdate, CreateTopPagination} from './FuzzyTablePagination.js'
import createSizeSelector from './FuzzyTableSizeSelect.js'

export default class FuzzyTable {
    constructor(containerId, data, head, options = {}) {
        this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
        this.data = [...(data ?? JSON.parse(this.container.dataset.rows))];
        this.head = head ?? JSON.parse(this.container.dataset.head);
        this.config = options;
        this.query = '';
        this.sortedCol = '';
        this.filters = (options.filters ?? []).map(filter => {
            const selected = filter.options.find(option => option.active);
            return {
                ...filter,
                options: filter.options.map(option => ({
                    ...option,
                    active: filter.filterType === 'radio' ? option === selected : option.active
                }))
            };
        });

        this.size = (options.pageSize ?? this.container?.dataset?.pageSize) ?? 100;
        this.currentPage = 0;
        this.numberCol = options.numberCol ?? false;
        this.pageSizes = options.pageSizes ?? JSON.parse(this.container.dataset.pageSizes ?? '[50,100,250,1000,5000]');
        this.paginationArrowButtonsDisabled = options?.paginationArrowButtonsDisabled
        this.classes = mergeClasses(options.classes);
        this.aside = (options.aside ?? this.container?.dataset?.aside);
        this.checkMark = (options?.checkMark ?? this.container?.dataset?.checkMark) ?? '✓'
        this.xMark = (options?.xMark ?? this.container?.dataset?.xMark) ?? '✗'
        this.locale = options.locale ?? 'en'
        this.numberFormatter = new Intl.NumberFormat(this.locale);
        this.t = options.t ?? {search_placeholder: 'Search'}
        this.vernacularNumerals = options.vernacularNumerals ?? true;
        this.render();
    }

    setData(newData) {
        this.data = [...newData];
        this.searchIndex = createSearchIndex(this.excludedFields);
        filterAwareSearch(this);
    }

    render = () => {
        this.excludedFields = new Set();
        const includedFields = new Set();
        for (const column of this.head) {
            const fields = column.searchable === false ? this.excludedFields : includedFields;
            fields.add(column.id);
            if (column.subtitle) fields.add(column.subtitle);
        }
        for (const field of includedFields) this.excludedFields.delete(field);
        this.searchIndex = createSearchIndex(this.excludedFields);
        refreshRows(this);
        this.container.innerHTML = '';
        createFilters(this)
        const tableContainer = document.createElement('div');
        tableContainer.className = this.classes.tableContainer

        const tableHeader = document.createElement('div')
        tableHeader.className = this.classes.tableHeader

        tableHeader.appendChild(createSearchBox(this))
        tableHeader.appendChild(CreateTopPagination(this))
        tableHeader.appendChild(createDownloadUI(this))
        tableHeader.appendChild(createSizeSelector(this))

        const table = document.createElement('table');
        table.className = this.classes.table;
    
        const thead = document.createElement('thead');
        if(this.classes.thead) {
            thead.className = this.classes.thead;
        }

        const headerRow = thead.insertRow();
        const initialSort = !this.query && this.head.find(column => column.sortDir);
        this.sortedCol = initialSort ? initialSort.id : '';
        this.sortDescending = initialSort?.sortDir === 'descending';
        if (initialSort) sort(this, initialSort, this.sortDescending);
        this.sortArrows = [];
        if (this.numberCol) {
            const numTh = document.createElement('th');
            numTh.className = `${this.classes.th ?? ''} number-column`;
            numTh.textContent = '#'; // Column header for numbering
            headerRow.appendChild(numTh);
        }

        for (const column of this.head) {
            const th = document.createElement('th');
            th.className = `${this.classes.th ?? ''} ${column.class ?? ''}`;
            th.innerHTML = column.name;
            const arrowUp = document.createElement('span');
            const arrowDown = document.createElement('span');
            arrowUp.className = this.classes.arrowUp;
            arrowDown.className = this.classes.arrowDown;
            arrowUp.textContent = '▲';
            arrowDown.textContent = '▼';
            arrowUp.style.opacity = (column === initialSort && !this.sortDescending) ? 1 : 0.35;
            arrowDown.style.opacity = (column === initialSort && this.sortDescending) ? 1 : 0.35;
        
            this.sortArrows.push(arrowUp, arrowDown);
            th.appendChild(arrowUp);
            th.appendChild(arrowDown);
        
            th.addEventListener('click', () => {
                this.sortDescending = this.sortedCol === column.id && !this.sortDescending;
                this.sortedCol = column.id;
                for (const arrow of this.sortArrows) arrow.style.opacity = 0.35;
                (this.sortDescending ? arrowDown : arrowUp).style.opacity = 1;
                sort(this, column, this.sortDescending);
                this.updateTable();
            });
        
            headerRow.appendChild(th);
        }
        
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        tbody.id = "fuzzy-rows";
        if(this.classes.tbody) {
            tbody.className = this.classes.tbody;
        }
        
        this.tbody = tbody;
        createTbody(this, tbody);
        table.appendChild(tbody);

        tableContainer.appendChild(tableHeader)
        tableContainer.appendChild(table);
        CreatePagination(this, tableContainer)
        this.container.append(tableContainer);
    }

    resetSort() {
        this.sortedCol = '';
        for (const arrow of this.sortArrows) arrow.style.opacity = 0.35;
    }

    destroy() {
        this.downloadEvents?.abort();
        this.container.replaceChildren();
    }

    safeHtml = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
    
        for (const tag of ['script', 'iframe', 'link', 'style', 'object', 'embed']) {
            const nodes = tempDiv.getElementsByTagName(tag);
            for (let i = nodes.length - 1; i >= 0; i--) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    
        return tempDiv.firstChild;
    }

    paginationUpdate = () => pUpdate(this)
    updateTable = () => createTbody(this, this.tbody)
}