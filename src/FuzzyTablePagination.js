import { elem } from "./FuzzyTableHelper";

/**
 * Initializes and appends pagination navigation elements to a table container.
 * If the pagination navigation doesn't exist, it creates one and updates it.
 * 
 * @param {Object} context - The context containing pagination details and classes for styling.
 * @param {HTMLElement} tableContainer - The container to which the pagination elements will be appended.
 */
export default function CreatePagination(context, tableContainer) {
    if (!context.paginationNav) {
        context.paginationNav = elem('nav', { id: 'paginationNav', className: context.classes.paginationNav || '' });
        const tablePagination = elem('div', {
            id: 'paginationContainer',
            className: context.classes.tablePagination || ''
        });
        tablePagination.appendChild(context.paginationNav)
        context.paginationDescription = elem('div', {
            id: 'paginationDescription',
            className: context.classes.paginationDescription || ''
        });
        tablePagination.appendChild(context.paginationDescription);
        tableContainer.appendChild(tablePagination);
    }

    paginationUpdate(context);
}

export function CreateTopPagination(context) {
    if (!context.topPaginationNav) {
      context.topPaginationNav = elem("nav", {id: "topPaginationNav", className: context.classes.topPaginationNav || ""});
    }
    topPaginationUpdate(context);
    return context.topPaginationNav;
}
  
  /**
   * Updates the top pagination navigation element with a left arrow (if applicable),
   * a current page display, and a right arrow (if applicable).
   *
   * @param {Object} context - The context with table data, current page, and config info.
   */
  function topPaginationUpdate(context) {
    const nav = context.topPaginationNav;
    const totalPages = Math.ceil(context.table.length / context.size);
    nav.innerHTML = "";
    const fragment = document.createDocumentFragment();
    if (context.currentPage > 0 && !context.paginationArrowButtonsDisabled) {
      fragment.appendChild(createArrowElement(context, "back", "top"));
    }
    const currentDisplay = elem("span", {
      textContent: `${context.numberFormatter.format(context.currentPage + 1)}/${context.numberFormatter.format(totalPages)}`,
      className: context.classes.topPaginationCurrent || ""
    });
    fragment.appendChild(currentDisplay);
    if (context.currentPage < totalPages - 1 && !context.paginationArrowButtonsDisabled) {
      fragment.appendChild(createArrowElement(context, "forward", "top"));
    }
    nav.appendChild(fragment);
  }

/**
 * Updates the pagination navigation based on the current context. It recalculates the pages to display
 * and refreshes the navigation bar accordingly.
 * @param {Object} context - The context with pagination data and configurations.
 */
export const paginationUpdate = (context) => {
    const nav = context.paginationNav;
    const totalPages = Math.ceil(context.table.length / context.size);
    context.displayPages = calculateDisplayPages(context.currentPage, totalPages, 4);
    nav.innerHTML = '';

    const fragment = document.createDocumentFragment();

    if (context.currentPage > 0 && !context.paginationArrowButtonsDisabled) {
        fragment.appendChild(createArrowElement(context, 'back'));
    }

    for (const page of context.displayPages) {
        fragment.appendChild(createPageElement(context, page));
    }

    if (context.currentPage < totalPages - 1 && !context.paginationArrowButtonsDisabled) {
        fragment.appendChild(createArrowElement(context, 'forward'));
    }

    const { paginationDescriptionStart, paginationDescriptionEnd, paginationDescriptionTotal } = context.classes;

    context.paginationDescription.innerHTML = `
        ${context.t?.showing ?? ''} 
        <span class="${paginationDescriptionStart}">${context.numberFormatter.format(context.currentPage * context.size + 1)}</span>
        ${context.t?.to ?? '-'}
        <span class="${paginationDescriptionEnd}">${context.numberFormatter.format(Math.min((context.currentPage + 1) * context.size, context.table.length))}</span>
        ${context.t?.of ?? '/'}
        <span class="${paginationDescriptionTotal}">${context.numberFormatter.format(context.table.length)}</span>
        ${context.t?.entries ?? ''}
    `;
    topPaginationUpdate(context)
    nav.appendChild(fragment);
};

/**
 * Creates an arrow element (back or forward) for pagination navigation.
 */
function createArrowElement(context, direction, location = "bottom") {

    const classes = (location == "top" ? context.classes.paginationTopArrow : [
        context.classes.paginationButton, context.classes.paginationArrow || ''].join(' ')) 

    return elem('button', {
        textContent: direction === 'back' ? '<' : '>',
        className: classes,
        onclick: () => {
            context.currentPage += direction === 'back' ? -1 : 1;
            context.updateTable();
            paginationUpdate(context);
        }
    });
}

/**
 * Creates a single page element for pagination, which could be a number button or an ellipsis.
 * @param {Object} context - The context containing the current page and classes for styling.
 * @param {Number|String} page - The page number or an ellipsis ('...').
 * @returns {HTMLElement} The page element (either a span or a button).
 */
function createPageElement(context, page) {
    if (page === '...') {
        return elem('span', {
            textContent: '...',
            className: context.classes.paginationButton
        });
    }

    return elem('button', {
        textContent: context.numberFormatter.format(page + 1),
        className: [
            context.classes.paginationButton,
            context.currentPage === page ? context.classes.paginationButtonCurrent : ''
        ].join(' '),
        onclick: () => {
            context.currentPage = page;
            context.updateTable();
            paginationUpdate(context);
        }
    });
}

/**
 * Calculates the page numbers to display in pagination. This includes handling '...' for skipped sections.
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