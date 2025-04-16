import { elem } from './FuzzyTableHelper.js';

import {createSVG} from './FuzzyTableBody.js'
import { filterAwareSearch } from './FuzzyTableSearch.js';

/**
 * Initializes filter elements based on the provided context and appends them to the context's container.
 * Only executes if there are filters defined in the context.
 * 
 * @param {Object} context - The configuration object that includes the container and filters data.
 * @param {HTMLElement} context.container - The DOM element to append the filter container.
 * @param {Array} context.filters - Array of filter definitions.
 */
export function createFilters(context) {
    if (context.aside) {
      const asideContainer = elem('aside', { innerHTML: context.aside });
      context.container.appendChild(asideContainer);
    }
    if (context.filters.length > 0) {
      const filterContainer = elem('div', {
        className: context.classes.filterContainer,
        id: 'fuzzy_filters'
      });
      context.filters.forEach((filter, filterKey) => {
        const filterName = elem('div', {
          className: context.classes.fieldsetWrap,
          textContent: filter.name
        });
        filterContainer.appendChild(filterName);
        const fieldset = createFilterFieldset(filter, filterKey, applyFilters, context);
        filterContainer.appendChild(fieldset);
      });
  
      context.container.appendChild(filterContainer);
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
function createFilterButton(filter, classes, option, onClick) {

  const filterFragment = document.createDocumentFragment();

  if (filter.icon) {
    filterFragment.appendChild(createSVG(filter.icon, option.code ?? ''));
  }
  
  filterFragment.appendChild(document.createTextNode(option.title ?? ''));
  const buttonEl = elem('button', {
    className: `${classes.filterButton} ${option.active ? classes.filterButtonActive : ''}`,
    onclick: onClick
  });

    buttonEl.appendChild(filterFragment);
    return buttonEl;
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
    const fieldset = elem('fieldset', { className: context.classes.fieldset });
    filter.options.forEach((option, optionKey) => {
      const button = createFilterButton(
        filter,
        context.classes,
        option,
        () => applyFilters(context, filterKey, optionKey)
      );
      fieldset.appendChild(button);
    });
    return fieldset;
  }

/**
 * Applies the specified filter option and updates the table and filter UI accordingly.
 * 
 * @param {Object} c - The context containing the current data, filters, and configuration.
 * @param {Number} filterKey - The index of the current filter in the filters array.
 * @param {Number} optionKey - The index of the current option in the filter's options array.
 */
export function applyFilters(c, filterKey, optionKey) {
  // Mark the selected filter option as active if it has a value
  c.filters[filterKey].options[optionKey].active =
    c.filters[filterKey].options[optionKey].values !== "";

  // If it's a radio filter, deactivate all other options in that group
  if (c.filters[filterKey].filterType === "radio") {
    c.filters[filterKey].options.forEach((option, i) => {
      if (i !== optionKey) {
        option.active = false;
      }
    });
  }

  // Delegate table update to filterAwareSearch (which handles both filters + fuzzy search)
  filterAwareSearch(c);

  // Update UI to reflect active filters
  const filterContainer = document.getElementById("fuzzy_filters");
  if (!filterContainer) return;

  const fieldsets = Array.from(filterContainer.querySelectorAll("fieldset"));
  const activeClasses = c.classes.filterButtonActive.trim().replace(/\s+/g, " ").split(" ");

  c.filters.forEach((filter, fIndex) => {
    const fieldset = fieldsets[fIndex];
    if (!fieldset) return;

    filter.options.forEach((option, oIndex) => {
      const button = fieldset.children[oIndex];
      if (!button) return;

      activeClasses.forEach((className) => {
        if (option.active) {
          button.classList.add(className);
        } else {
          button.classList.remove(className);
        }
      });
    });
  });
}

