/**
 * Sorts the data table in the given context based on the specified column.
 * It toggles the sorting order for the column between ascending and descending.
 * The sorting behavior varies depending on the data type of the column (integer or string).
 *
 * @param {Object} context - The context containing the table to be sorted and sorting states.
 * @param {Object} column - The column definition based on which the table should be sorted.
 * @param {string} column.id - The identifier of the column used for sorting.
 * @param {string} column.type - The data type of the column (e.g., 'int' for integers).
 * @returns {Array} The sorted array from the context's table.
 */
export function sort(context, column) {
    const id = column.id;
    const isDescending = context.sortedCol === id;
    context.sortedCol = isDescending ? "" : id;  // Toggle sorted column

    if (column.type === "int" || column.type === "year") {
        return context.table.sort((a, b) => isDescending ? b[id] - a[id] : a[id] - b[id]);
    }

    return context.table.sort((a, b) => {
        const current = a[id] ?? "";
        const next = b[id] ?? "";
        return isDescending ? next.localeCompare(current) : current.localeCompare(next);
    });
}