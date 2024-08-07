import Fuse from './Fuse.mjs'
import { sort } from './FuzzyTableSort.mjs'
import { createTbody } from './FuzzyTableBody.mjs'
import { mergeClasses } from './FuzzyTableStyles.mjs'
import createFilters from './FuzzyTableFilters.mjs'
import createSearchBox from './FuzzyTableSearch.mjs'
import createDownloadUI from './FuzzyTableDownloader.mjs'
import CreatePagination, {paginationUpdate as pUpdate} from './FuzzyTablePagination.mjs'
import createSizeSelector from './FuzzyTableSizeSelect.mjs'

export default class FuzzyTable {
    constructor(containerId, data, head, options) {
        this.container = document.getElementById(containerId);
        if(data) {
            this.data = [...data]; // Holder for inital data
            this.table = [...data]; // User's current view
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
            this.head = head; // Holder for inital data
        } else {
            this.head = [...JSON.parse(this.container.dataset.head)];
        }

        this.filteredTable = [];
        this.size = (options.pageSize ?? this.container?.dataset?.pageSize) ?? 10;
        this.currentPage = 0;
        this.pageSizes = [10, 150, 500, 1000, 5000];
        this.classes = mergeClasses(options.classes);
        this.locale = options.locale ?? 'en'
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

    // 
    render = () => {
        this.container.innerHTML = '';
        createFilters(this)
        const tableContainer = document.createElement('div');
        tableContainer.className = this.classes.tableContainer

        const tableHeader = document.createElement('div')
        tableHeader.className = this.classes.tableHeader

        tableHeader.appendChild(createSearchBox(this))
        tableHeader.appendChild(createDownloadUI(this))
        tableHeader.appendChild(createSizeSelector(this))

        const table = document.createElement('table');
        table.className = this.classes.table;
    
        const thead = document.createElement('thead');
        thead.className = this.classes.thead;

        for (const column of this.head) {
            const th = document.createElement('th');
            th.className = `${this.classes.th} ${column.class}`;
            th.textContent = column.name;
        
            // Create span elements for both sorting arrows
            const arrowUp = document.createElement('span');
            const arrowDown = document.createElement('span');
            arrowUp.className = this.classes.arrowUp;
            arrowDown.className = this.classes.arrowDown;
            arrowUp.textContent = '▲'; // Ascending arrow
            arrowDown.textContent = '▼'; // Descending arrow
            arrowUp.style.opacity = 0.35; // Low opacity by default
            arrowDown.style.opacity = 0.35; // Low opacity by default
        
            th.appendChild(arrowUp);
            th.appendChild(arrowDown);
        
            // Add click event to sort and toggle arrow opacity
            th.addEventListener('click', () => {
                // Reset opacity for all arrows in all columns
                for (const arrow of document.querySelectorAll('th span')) {
                    arrow.style.opacity = 0.35;
                }
        
                // Determine current sort direction and adjust arrow opacity accordingly
                const isAscending = th.classList.toggle('ascending');
                if (isAscending) {
                    arrowUp.style.opacity = 1; // Full opacity for active arrow
                    arrowDown.style.opacity = 0.35;
                } else {
                    arrowDown.style.opacity = 1; // Full opacity for active arrow
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
        tbody.className = this.classes.tbody;

        createTbody(this, tbody);
        table.appendChild(tbody);

        tableContainer.appendChild(tableHeader)
        tableContainer.appendChild(table);
        CreatePagination(this, tableContainer)
        this.container.append(tableContainer);
    }

    safeHtml = (html) => {
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
    
        for (const tag of ['script', 'iframe', 'link', 'style', 'object', 'embed']) {
            let nodes = tempDiv.getElementsByTagName(tag);
            for (let i = nodes.length - 1; i >= 0; i--) {
                nodes[i].parentNode.removeChild(nodes[i]);
            }
        }
    
        return tempDiv.firstChild;
    }

    paginationUpdate = () => pUpdate(this)
    updateTable = () => createTbody(this, document.getElementById('fuzzy-rows'))
}