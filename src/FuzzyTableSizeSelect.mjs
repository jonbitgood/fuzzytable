/**
 * Creates a dropdown selector for choosing the pagination size in a table. This selector allows users to
 * change how many table rows are displayed per page. The function dynamically creates a select element with
 * options that reflect the possible page sizes defined in the context. It also handles the change event to
 * update the table's pagination size and refreshes the table view accordingly.
 *
 * @param {Object} context - The context for FuzzyTable
 * @returns {HTMLElement} - The container div element that includes the size selector and its label.
 */
export default function createSizeSelector(context) {
    const sizeSelectContainer = document.createElement('div');
    sizeSelectContainer.className = 'relative inline-block';
    const label = document.createElement('label')
    label.setAttribute('for', 'fuzzy_size_select')
    label.className = 'sr-only'
    label.textContent = 'Select Page Size'
    sizeSelectContainer.appendChild(label)
    const select = document.createElement('select');
    select.id = 'fuzzy_size_select';
    select.className = context.classes.sizeSelect;
    sizeSelectContainer.appendChild(select);

    const numberFormatter = new Intl.NumberFormat(context.locale);
    
    for (const pageSize of context.pageSizes.filter(size => size <= context.data.length)) {
        const option = document.createElement('option')
        option.value = pageSize;
        option.textContent = numberFormatter.format(pageSize)
        select.appendChild(option)
    }
    
    select.value = context.size;
    select.addEventListener('change', (e) => {
        context.size = e.target.value;
        context.paginationUpdate();
        context.updateTable();
    });
    
    return sizeSelectContainer
}