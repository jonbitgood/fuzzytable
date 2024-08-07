const defaultClasses = {
    pagination: '',
    sortArrow: '',

    arrowUp: 'absolute right-2 top-0.5 text-sm',
    arrowDown: 'absolute right-2 bottom-0.5 text-sm',

    paginationButton: 'w-10 h-10 inline-flex justify-center items-center border dark:border-stone-900',
    paginationButtonCurrent: 'text-lg font-bold dark:text-white',
    paginationNav: 'relative z-0 flex mt-4 justify-center rounded-md -space-x-px dark:text-stone-300',

    downloadButton: 'relative inline-flex items-center bg-white dark:bg-stone-700 px-2 h-10 dark:text-stone-300 ring-1 ring-inset ring-stone-400 dark:ring-stone-800 focus:z-10',
    downloadDropdown: 'absolute left-0 z-50 -mr-1 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-stone-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
    downloadDropdownButton: 'text-stone-700 dark:text-stone-300 hover:dark:bg-stone-900 hover:bg-stone-200 w-full block px-4 py-2 text-sm text-left',
    downloadDropdownInfo: 'text-center text-xs text-stone-700 dark:text-stone-300 py-2',

    fieldsetWrap: 'block mt-8 w-full bg-gray-200 dark:bg-stone-700 text-sm font-semibold p-3 text-stone-900 dark:text-stone-300 border-b border-stone-200 dark:border-stone-500 rounded-t-lg',
    fieldsetFilterWrap: 'mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2',
    fieldset: 'mb-4 dark:bg-stone-900 border border-stone-200 dark:border-stone-950 p-2',
    filterContainer: 'hidden sm:flex flex-col lg:w-1/5 ltr:mr-4 rtl:ml-4',
    filterButton: 'text-sm relative px-2 py-1 my-2 w-full flex items-center justify-center cursor-pointer rounded-lg border dark:text-stone-300 dark:bg-stone-800 border-stone-200 dark:border-stone-500 shadow-sm',
    filterButtonActive: 'bg-stone-400 dark:bg-stone-950 dark:text-white border-stone-800',

    tableContainer: 'flex flex-col w-full relative z-10 max-w-7xl mx-auto border-2 border-stone-200 dark:border-stone-800',
    tableColumn: 'whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]',

    searchInput: 'relative indent-6 block w-full h-12 px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-700 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100 ltr:rounded-tl-xl rtl:rounded-tr-xl',
    searchIcon: 'absolute block w-6 h-6 z-30 mt-3 mx-2 text-white',
    searchWrapper: 'w-full h-12',

//    searchBox: 'block w-full h-12 px-4 text-sm shadow-lg border border-stone-400 dark:border-stone-800 dark:bg-stone-800 text-stone-800 dark:text-stone-300 placeholder-stone-800 dark:placeholder-stone-100',

    sizeSelect: 'appearance-none w-full h-full px-6 bg-white dark:bg-stone-700 dark:text-stone-300 text-center border-0 ring-1 ring-inset ring-stone-400 dark:ring-stone-800 rtl:md:rounded-tl-lg ltr:md:rounded-tr-lg',

    tableHeader: 'flex flex-row md:mt-8 h-10',
    tableCellLink: 'dark:text-white',
    tableCellSubtitle: 'block not-italic text-stone-400 dark:text-stone-700',
    table: 'w-full',
    thead: 'bg-stone-100 dark:bg-stone-700',
    tbody: 'divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-800 border border-stone-500 dark:border-none',
    th: 'relative px-1 py-2 px-2 rtl:pr-7 ltr:text-left rtl:text-right text-sm font-semibold text-stone-900 dark:text-stone-300 cursor-pointer',
    tr: 'dark:even:bg-stone-900',
    td: 'whitespace-nowrap px-3 py-2 text-sm text-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-800 relative truncate max-w-[240px]',
};

/**
 * Merges custom CSS class definitions with a set of default classes. If a key in the custom classes starts
 * with an underscore, it will overwrite the corresponding default class after removing the underscore.
 * Keys without an underscore will simply merge by replacing the existing default with the custom class.
 *
 * @param {Object} customClasses - An object containing custom class definitions. Keys starting with
 *                                 an underscore indicate classes that should overwrite default classes.
 * @returns {Object} An object containing the merged classes.
 */
export const mergeClasses = (customClasses = {}) => {
    const mergedClasses = { ...defaultClasses };
    for (const key of Object.keys(customClasses)) {
        if (key.startsWith('_')) {
            mergedClasses[key.substring(1)] = customClasses[key];
        } else {
            mergedClasses[key] = customClasses[key];
        }
    }

    return mergedClasses;
};
