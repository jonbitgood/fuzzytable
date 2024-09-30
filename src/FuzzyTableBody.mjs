
/**
 * Dynamically creates and populates a table body (`tbody`) with data and elements based on the provided context and 
 * table head definitions. It handles pagination, text formatting, and optional linking and icons for each cell.
 * 
 * @param {Object} context - The FuzzyTable
 * @param {HTMLElement} tbody - The table body element where rows will be appended.
 */
export const createTbody = (context, tbody) => {
    const calculateRange = (page, size) => [(page + 1) * size - size, (page + 1) * size];
    const [start, end] = calculateRange(context.currentPage, context.size);
    const tableSlice = context.table.slice(start, end);

    tbody.innerHTML = '';
    for (const row of tableSlice) {
        const tr = document.createElement('tr');
        tr.className = context.classes.tr;

        for (const column of context.head) {
            const td = document.createElement('td');
            td.className = `${column.class ?? ''} ${column.id} ${context.classes.tableColumn ?? ''}`;
            if(column.type) {
                td.setAttribute('data-type', column.type);
            }
            

            const cellValue = row[column.id] ?? '';
            const formattedValue = formatCellContent(context, cellValue, column.type, context.locale);
            const content = new DocumentFragment();
            if (column.icon) {
                content.appendChild(createSVG(column.icon, row[column.icon.id] ?? ''));
            }

            if(column.img) {
                content.appendChild(createImg(column.img, row[column.img.id] ?? ''));
            }

            content.appendChild(document.createTextNode(formattedValue));

            if(column.subtitle) {
                const subtitle  = document.createElement('em')
                subtitle.className = context.classes.tableCellSubtitle;
                subtitle.innerText = row[column.subtitle] ?? ''
                content.appendChild(subtitle);
            }

            if (column.link) {
                const a = document.createElement('a')
                a.className = context.classes.tableCellLink
                a.href = `${column.link.base ? column.link.base : ''}${row[column.link.id]}`
                a.appendChild(content)
                td.appendChild(a)
            } else {
                td.appendChild(content)
            }

            if (column.suffix && cellValue !== '') {
                td.appendChild(context.safeHtml(column.suffix))
            }

            if(column.hideZeros && cellValue === 0) {
                td.classList.add("hidden");
            }

            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}



const createSVG = (icon, value) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `${icon.base}${value}`);
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${value}`);
    if(icon.class) {
        svg.setAttribute('class', icon.class);    
    }
    svg.appendChild(use);
    return svg;
};

const createImg = (img, value) => {
    const imgEl = document.createElement('img');
    imgEl.setAttribute('src', `${img.base}${value}${img.ext ?? ''}`);
    if(img.class) {
        imgEl.setAttribute('class', img.class);        
    }
    return imgEl;
}

const formatCellContent = (context, cellValue, type, locale) => {
    if (type === 'int') {
        return new Intl.NumberFormat(locale).format(cellValue);
    }
    if (type === 'date' || type === 'year') {
        if (type === 'date') {
            const date = new Date(cellValue);
            return new Intl.DateTimeFormat(locale).format(date);
        } else if (type === 'year') {
            const date = new Date(cellValue,0, 1);
            return new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date);
        }
    }
    if (type === 'bool') {
        return (cellValue) ? context.checkMark : context.xMark
    }

    return cellValue;
};
