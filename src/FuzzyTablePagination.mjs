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
        if(context.classes.paginationNav) {
            context.paginationNav.className = context.classes.paginationNav;
        }

        const tablePagination = document.createElement('div');
        if(context.classes.tablePagination) {
            tablePagination.className = context.classes.tablePagination;
        }
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
export const paginationUpdate = (context) => {
    const nav = context.paginationNav;
    const totalPages = Math.ceil(context.table.length / context.size);
    context.displayPages = calculateDisplayPages(context.currentPage, totalPages, 4);
    nav.innerHTML = '';

    const fragment = document.createDocumentFragment();

    if (context.currentPage > 0 && !context.paginationArrowButtonsDisabled) {
        const backArrow = createArrowElement(context, 'back');
        fragment.appendChild(backArrow);
    }

    for (const page of context.displayPages) {
        const pageElement = createPageElement(context, page);
        fragment.appendChild(pageElement);
    }

    // Add forward arrow if not on the last page
    if (context.currentPage < totalPages - 1 && !context.paginationArrowButtonsDisabled) {
        const forwardArrow = createArrowElement(context, 'forward');
        fragment.appendChild(forwardArrow);
    }

    nav.appendChild(fragment);
};

/**
 * Creates an arrow element (back or forward) for pagination navigation.
 * 
 * @param {Object} context - The context containing the current page and classes for styling.
 * @param {String} direction - The direction of the arrow ('back' or 'forward').
 * @returns {HTMLElement} The arrow button element.
 */
function createArrowElement(context, direction) {
    const button = document.createElement('button');
    button.textContent = direction === 'back' ? '<' : '>';
    button.classList.add(...context.classes.paginationButton.split(' '));

    if (context.classes.paginationArrow) {
        button.classList.add(...context.classes.paginationArrow.split(' '));
    }

    button.onclick = () => {
        context.currentPage += direction === 'back' ? -1 : 1;
        context.updateTable();
        paginationUpdate(context);
    };

    return button;
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
        span.classList.add(...context.classes.paginationButton.split(' '));
        span.textContent = '...';
        return span;
    }

    const button = document.createElement('button');
    button.textContent = context.numberFormatter.format(page + 1);
    button.classList.add(...context.classes.paginationButton.split(' '));

    if (context.currentPage === page) {
        button.classList.add(...context.classes.paginationButtonCurrent.split(' '));
    }

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
    const pages = [];
    const start = Math.max(current - sides, 0);
    const end = Math.min(current + sides, total - 1);

    if (start > 1) {
        pages.push(0, '...');
    } else if (start === 1) {
        pages.push(0);
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < total - 2) {
        pages.push('...', total - 1);
    } else if (end === total - 2) {
        pages.push(total - 1);
    }

    return pages;
}