
/**
 * Dynamically creates and populates a table body (`tbody`) with data and elements based on the provided context and 
 * table head definitions. It handles pagination, text formatting, and optional linking and icons for each cell.
 * 
 * @param {Object} context - The FuzzyTable
 * @param {HTMLElement} tbody - The table body element where rows will be appended.
 */
export const createTbody = (context, tbody) => {

    const tableSlice = context.table.slice(((context.currentPage +1) * context.size) - context.size, (context.currentPage + 1) * context.size)

    tbody.innerHTML = '';
    if (tableSlice.length > 0) {
        for (const row of tableSlice) {
            const tr = document.createElement('tr');
            tr.className = context.classes.tr;
            for (const column of context.head) {
                const td = document.createElement('td');
                td.className = `${column.class} ${column.id} ${context.classes.tableColumn}`;

                let content = document.createDocumentFragment();
                if (column.icon) {
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('class', column.icon.class);

                    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    use.setAttribute('href', `${column.icon.base}${row[column.icon.id] ?? ''}`);
                    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${row[column.icon.id]}`);

                    svg.appendChild(use);
                    content.appendChild(svg);
                }

                const cellValue = row[column.id] ?? '';
                
                let textNode
                if(column.type === 'int') {
                    const numberFormatter = new Intl.NumberFormat(context.locale);
                    textNode = document.createTextNode(numberFormatter.format(cellValue));
                } else {
                    textNode = document.createTextNode(cellValue);
                }

                content.appendChild(textNode);

                if (column.link) {
                    const a = document.createElement('a');
                    a.href = `${column.link.base ? column.link.base : ''}${row[column.link.id]}`;
                    a.appendChild(content);
                    td.appendChild(a);
                } else {
                    td.appendChild(content);
                }

                if (column.suffix && cellValue !== '') {
                    td.appendChild(context.safeHtml(column.suffix));
                }

                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }
};
