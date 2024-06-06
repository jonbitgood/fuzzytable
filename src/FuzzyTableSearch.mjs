/**
 * Creates a search input element for filtering table data. This search box dynamically filters the table
 * based on user input. If the search box is empty, it applies active filters from the context to the data.
 * If there is a search term, it uses Fuse.js to perform a fuzzy search and updates the table accordingly.
 *
 * @param {Object} context - The FuzzyTable context
 * @returns {HTMLInputElement} - The created search input element that is configured to filter the table data on input.
 */
export default function createSearchBox(context) {
    const searchBox = document.createElement('input');
    searchBox.type = 'search';
    searchBox.id = 'fuzzy_search';
    searchBox.placeholder = context.t?.search_placeholder ?? 'Search';
    searchBox.className = context.classes.searchInput;
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
    }
    context.searchBox = searchBox

    return searchBox
}
