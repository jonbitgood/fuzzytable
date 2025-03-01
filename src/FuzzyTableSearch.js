import { elem } from "./FuzzyTableHelper";
import paginationUpdate from './FuzzyTablePagination.js'

/**
 * Creates a search input element for filtering table data. This search box dynamically filters the table
 * based on user input. If the search box is empty, it applies active filters from the context to the data.
 * If there is a search term, it uses Fuse.js to perform a fuzzy search and updates the table accordingly.
 *
 * @param {Object} context - The FuzzyTable context
 * @returns {HTMLInputElement} - The created search input element that is configured to filter the table data on input.
 */

export default function createSearchBox(context) {
    const label = elem('label', { className: context.classes.searchWrapper });

    const searchBox = elem('input', {
        type: 'search',
        id: 'fuzzy_search',
        placeholder: context.t?.search_placeholder ?? 'Search',
        className: context.classes.searchInput,
    });
    searchBox.oninput = () => {
        if(context.searchBox.value !== "") {
            context.table = context.fuse.search(context.searchBox.value).slice(0, 100).map(item => item.item)
        } else {
            let tempTable = context.data;

            for (const filter of context.filters) {
                for (const option of filter.options.filter(option => option.active)) {
                    tempTable = tempTable.filter((row) => {
                        const match = option.value.test(row[filter.filterColumn]);
                        option.active = true;
                        return (option.inverse) ? !match : match}
                    );
                }
            }

            context.table = tempTable
        }

        context.currentPage = 0;
        context.updateTable();
        paginationUpdate(context)
    }
    context.searchBox = searchBox

    const iconContainer = elem('span', {
        className: context.classes.searchIcon,
        innerHTML: `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>`
    });

    label.append(iconContainer, searchBox);
    context.searchBox = searchBox;

    return label;
}