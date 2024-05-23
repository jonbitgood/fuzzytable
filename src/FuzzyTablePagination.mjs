/**
 * Initializes and appends pagination navigation elements to a table container.
 * If the pagination navigation doesn't exist, it creates one and updates it.
 * 
 * @param {Object} context - The context containing pagination details and classes for styling.
 * @param {HTMLElement} tableContainer - The container to which the pagination elements will be appended.
 */
export default function CreatePagination(context, tableContainer) {
    if (!context.paginationNav) {
        context.paginationNav = document.createElement('nav');
        context.paginationNav.id = 'paginationNav';
        context.paginationNav.className = context.classes.paginationNav;

        const tablePagination = document.createElement('div');
        tablePagination.className = context.classes.tablePagination;
        tablePagination.id = 'paginationContainer';
        tablePagination.appendChild(context.paginationNav);
        tableContainer.appendChild(tablePagination);
    }

    paginationUpdate(context);
}

/**
 * Updates the pagination navigation based on the current context. It recalculates the pages to display
 * and refreshes the navigation bar accordingly.
 * 
 * @param {Object} context - The context with pagination data and configurations.
 */
export function paginationUpdate(context) {
    const nav = context.paginationNav;
    nav.innerHTML = '';  // Clear previous pagination buttons

    const displayPages = calculateDisplayPages(context.currentPage, Math.ceil(context.table.length / context.size), 4);
    const fragment = document.createDocumentFragment();

    for (const page of displayPages) {
        const pageElement = createPageElement(context, page);
        fragment.appendChild(pageElement);
    }

    nav.appendChild(fragment);
}

/**
 * Creates a single page element for pagination, which could be a number button or an ellipsis.
 * 
 * @param {Object} context - The context containing the current page and classes for styling.
 * @param {Number|String} page - The page number or an ellipsis ('...').
 * @returns {HTMLElement} The page element (either a span or a button).
 */
function createPageElement(context, page) {
    if (page === '...') {
        const span = document.createElement('span');
        span.className = context.classes.paginationButton;
        span.textContent = '...';
        return span;
    }

    const numberFormatter = new Intl.NumberFormat(context.locale);
    const button = document.createElement('button');
    button.textContent = numberFormatter.format(page + 1);
    button.className = `${context.classes.paginationButton} ${context.currentPage === page ? context.classes.paginationButtonCurrent : ''}`;
    button.onclick = () => {
        context.currentPage = page;
        context.updateTable();
        paginationUpdate(context);
    };
    return button;
}

/**
 * Calculates the page numbers to display in pagination. This includes handling '...' for skipped sections.
 * 
 * @param {Number} current - The current page index.
 * @param {Number} total - The total number of pages.
 * @param {Number} sides - The number of pages to show beside the current page.
 * @returns {Array} An array of page indices and ellipsis where appropriate.
 */
function calculateDisplayPages(current, total, sides) {
    let start = Math.max(current - sides, 0);
    let end = Math.min(current + sides, total - 1);
    let pagesArray = [];

    if (start > 0) {
        pagesArray.push(0);
        if (start > 1) pagesArray.push('...');
    }

    for (let i = start; i <= end; i++) {
        pagesArray.push(i);
    }

    if (end < total - 1) {
        if (end < total - 2) pagesArray.push('...');
        pagesArray.push(total - 1);
    }

    return pagesArray;
}
