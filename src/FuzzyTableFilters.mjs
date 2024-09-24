import Fuse from './Fuse.mjs'

/**
 * Initializes filter elements based on the provided context and appends them to the context's container.
 * Only executes if there are filters defined in the context.
 * 
 * @param {Object} context - The configuration object that includes the container and filters data.
 * @param {HTMLElement} context.container - The DOM element to append the filter container.
 * @param {Array} context.filters - Array of filter definitions.
 */
export default function createFilters(context) {
    if (context.filters.length > 0) {
        context.container.appendChild(createFilterContainer(context, applyFilters));
    }
}

/**
 * Creates a button for a specific filter option.
 * 
 * @param {Object} classes - An object containing class names for styling.
 * @param {Object} option - The filter option object containing the title and active state.
 * @param {Function} onClick - The function to execute when the button is clicked.
 * @returns {HTMLElement} The constructed button element.
 */
function createFilterButton(classes, option, onClick) {
    const button = document.createElement('button');
    button.className = `${classes.filterButton} ${option.active ? classes.filterButtonActive : ''}`;
    button.textContent = option.title;
    button.onclick = onClick;
    return button;
}

/**
 * Creates a fieldset containing buttons for each option of a specific filter.
 * 
 * @param {Object} filter - The filter object containing options to create buttons for.
 * @param {Number} filterKey - The index of the filter in the filters array.
 * @param {Function} applyFilters - The callback function to apply filters.
 * @param {Object} context - The context for global configurations and states.
 * @returns {HTMLElement} The constructed fieldset element.
 */
function createFilterFieldset(filter, filterKey, applyFilters, context) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = context.classes.fieldset;
    filter.options.forEach((option, optionKey) => {
        const button = createFilterButton(context.classes, option, () => applyFilters(context, filterKey, optionKey));
        fieldset.appendChild(button);
    });
    return fieldset;
}

/**
 * Creates a container for all filter elements, structured with individual fieldsets for each filter.
 * 
 * @param {Object} context - The context with configurations for filters and styling.
 * @param {Function} applyFilters - The function to apply filter logic.
 * @returns {HTMLElement} The created filter container element.
 */
function createFilterContainer(context, applyFilters) {
    const filterContainer = document.createElement('div');
    filterContainer.className = context.classes.filterContainer;
    filterContainer.id = 'fuzzy_filters';

    context.filters.forEach((filter, filterKey) => {
        const filterName = document.createElement('div');
        filterName.className = context.classes.fieldsetWrap;
        filterName.textContent = filter.name;
        filterContainer.appendChild(filterName);

        const fieldset = createFilterFieldset(filter, filterKey, applyFilters, context);
        filterContainer.appendChild(fieldset);
    });

    return filterContainer;
}

/**
 * Applies the specified filter option and updates the table and filter UI accordingly.
 * 
 * @param {Object} c - The context containing the current data, filters, and configuration.
 * @param {Number} filterKey - The index of the current filter in the filters array.
 * @param {Number} optionKey - The index of the current option in the filter's options array.
 */
function applyFilters(c, filterKey, optionKey) {
    let tempTable = c.data;
    c.filters[filterKey].options[optionKey].active = c.filters[filterKey].options[optionKey].values !== "";
    if (c.filters[filterKey].filterType === "radio") {
        c.filters[filterKey].options.forEach((option, i) => {
            if (i !== optionKey) {
                c.filters[filterKey].options[i].active = false;
            }
        });
    }

    c.filters[filterKey].options[optionKey].active = true;
    for (const filter of c.filters) {
        for (const option of filter.options.filter(option => option.active)) {
            console.log(option)
            tempTable = tempTable.filter((row) => {
                const match = option.value.test(row[filter.filterColumn]);
                option.active = true;
                return (option.inverse) ? !match : match}
            );
        }
    }

    c.currentPage = 0
    c.table = tempTable;
    c.updateTable();

    c.fuse = new Fuse(c.table, {
        shouldSort: true,
        includeMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 50,
        maxPatternLength: 12,
        minMatchCharLength: 1,
        keys: c.head.filter(column => column.searchable !== false).map(column => column.id)
    })

    c.paginationUpdate(c)

    const filterContainer = document.getElementById('fuzzy_filters');
    c.filters.forEach((filter, filterKey) => {
        const fieldset = filterContainer.children[filterKey * 2 + 1]; // Accessing the correct fieldset based on index
        filter.options.forEach((option, optionKey) => {
            const button = fieldset.children[optionKey];
            const classList = c.classes.filterButtonActive.split(' ');
            for (const className of classList) {
                if (option.active) {
                    button.classList.add(className);
                } else {
                    button.classList.remove(className);
                }
            }
        });
    });
}