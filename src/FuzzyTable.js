import Fuse from './Fuse.js'
import { sort } from './FuzzyTableSort.js'
import { createTbody } from './FuzzyTableBody.js'
import { mergeClasses } from './FuzzyTableStyles.js'
import createFilters from './FuzzyTableFilters.js'
import createSearchBox from './FuzzyTableSearch.js'
import createDownloadUI from './FuzzyTableDownloader.js'
import CreatePagination, {paginationUpdate as pUpdate, CreateTopPagination} from './FuzzyTablePagination.js'
import createSizeSelector from './FuzzyTableSizeSelect.js'

export default class FuzzyTable {
    constructor(containerId, data, head, options) {
        this.container = document.getElementById(containerId);
        if(data) {
            this.data = [...data];
            this.table = [...data];
        } else {
            this.data = [...JSON.parse(this.container.dataset.rows)];
            this.table = [...JSON.parse(this.container.dataset.rows)];
        }

        this.searchBox;
        this.query =  '';
        this.sortedCol = '';
        this.filters = options.filters ?? [];
        this.head = head;

        if(head) {
            this.head = head;
        } else {
            this.head = [...JSON.parse(this.container.dataset.head)];
        }

        this.filteredTable = [];
        this.size = (options.pageSize ?? this.container?.dataset?.pageSize) ?? 100;
        this.currentPage = 0;
        this.pageSizes = (options.pageSizes ?? this.container?.dataset?.pageSizes) ?? [50, 100, 250, 1000, 5000];
        this.paginationArrowButtonsDisabled = options?.paginationArrowButtonsDisabled
        this.classes = mergeClasses(options.classes);
        this.aside = (options.aside ?? this.container?.dataset?.aside);
        this.checkMark = (options?.checkMark ?? this.container?.dataset?.checkMark) ?? '✓'
        this.xMark = (options?.xMark ?? this.container?.dataset?.xMark) ?? '✗'
        this.locale = options.locale ?? 'en'
        this.numberFormatter = new Intl.NumberFormat(this.locale);
        this.t = options.t ?? {search_placeholder: 'Search'}
        this.vernacularNumerals = options.vernacularNumerals ?? true;
        this.fuse = new Fuse(this.table, {
            shouldSort: true,
            includeMatches: true,
            threshold: 0.3,
            location: 0,
            distance: 50,
            maxPatternLength: 12,
            minMatchCharLength: 1,
            useExtendedSearch: true,
            keys: this.head.filter(column => column.searchable !== false).map(column => column.id)
        })
        this.render();
    }

    setData(newData) {
        this.update(() => {
            this.data = newData;
            this.table = newData;
            this.filteredTable = newData.filter(() => true);
        });
    }

    render = () => {
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

        for (const column of this.head) {
            const th = document.createElement('th');
            th.className = `${this.classes.th ?? ''} ${column.class ?? ''}`;
            th.textContent = column.name;
            const arrowUp = document.createElement('span');
            const arrowDown = document.createElement('span');
            arrowUp.className = this.classes.arrowUp;
            arrowDown.className = this.classes.arrowDown;
            arrowUp.textContent = '▲';
            arrowDown.textContent = '▼';
            arrowUp.style.opacity = 0.35;
            arrowDown.style.opacity = 0.35;
        
            th.appendChild(arrowUp);
            th.appendChild(arrowDown);
        
            th.addEventListener('click', () => {
                for (const arrow of document.querySelectorAll('th span')) {
                    arrow.style.opacity = 0.35;
                }
                const isAscending = th.classList.toggle('ascending');
                if (isAscending) {
                    arrowUp.style.opacity = 1;
                    arrowDown.style.opacity = 0.35;
                } else {
                    arrowDown.style.opacity = 1;
                    arrowUp.style.opacity = 0.35;
                }
                this.table = sort(this, column);
                this.updateTable();
            });
        
            thead.appendChild(th);
        }
        
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        tbody.id = "fuzzy-rows";
        if(this.classes.tbody) {
            tbody.className = this.classes.tbody;
        }
        
        createTbody(this, tbody);
        table.appendChild(tbody);

        tableContainer.appendChild(tableHeader)
        tableContainer.appendChild(table);
        CreatePagination(this, tableContainer)
        this.container.append(tableContainer);
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
    updateTable = () => createTbody(this, document.getElementById('fuzzy-rows'))
}