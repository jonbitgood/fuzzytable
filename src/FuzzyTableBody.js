
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

    const rows = document.createDocumentFragment();
    let rowIndex = start + 1;
    
    for (const row of tableSlice) {
        const tr = document.createElement('tr');
        tr.className = context.classes.tr;

        if (context.numberCol) {
            const numTd = document.createElement('td');
            numTd.className = `${context.classes.tableColumn ?? ''} number-column`;
            numTd.textContent = rowIndex++;
            tr.appendChild(numTd);
        }

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
            const matcher = column.searchable !== false && context.config.highlightMatches !== false
                ? context.matcher : null;
            appendValue(content, cellValue, formattedValue, matcher, context.classes.matchHighlight);
            if(column.subtitle) {
                const subtitle  = document.createElement('em')
                subtitle.className = context.classes.tableCellSubtitle;
                const value = row[column.subtitle] ?? '';
                appendValue(subtitle, value, value, matcher, context.classes.matchHighlight);
                content.appendChild(subtitle);
            }
            if (column.link) {
                const a = document.createElement('a')
                a.className = context.classes.tableCellLink
                a.href = `${column.link.base ? column.link.base : ''}${row[column.link.id]}`
                a.target = column.link.target ?? '_self'

                if(column.link.data) {
                    for (const key in column.link.data) {
                        const dataValue = column.link.data[key];
                        if (dataValue in row) {
                            a.dataset[key] = row[dataValue];
                        } else {
                            a.dataset[key] = dataValue;
                        }
                    }
                }
                
                a.appendChild(content)
                td.appendChild(a)
            } else {
                td.appendChild(content)
            }
            if (column.suffix && cellValue !== '') {
                const suffix = context.safeHtml(column.suffix);
                if (suffix) td.appendChild(suffix);
            }
            if(column.hideZeros && cellValue === 0) {
                td.classList.add("hidden");
            }
            tr.appendChild(td);
        }
        rows.appendChild(tr);
    }
    tbody.replaceChildren(rows);
}

function appendValue(parent, raw, formatted, matcher, className) {
    const text = String(formatted);
    if (!matcher || !text) {
        parent.append(text);
        return;
    }
    const original = String(raw);
    let ranges = matcher.ranges(original);
    if (ranges.length && text !== original) {
        ranges = matcher.ranges(text);
        // Formatting may replace the entire matching value, e.g. false → ✗.
        if (!ranges.length) ranges = [[0, text.length]];
    }
    let end = 0;
    for (const [start, next] of ranges) {
        if (start > end) parent.append(text.slice(end, start));
        const mark = document.createElement('mark');
        mark.className = className;
        mark.textContent = text.slice(start, next);
        parent.appendChild(mark);
        end = next;
    }
    if (end < text.length) parent.append(text.slice(end));
}

export const createSVG = (icon, value) => {
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
    if (cellValue === '') {
        return ''
    }
    if (type === 'int') {
        return context.numberFormatter.format(cellValue);
    }
    if (type === 'date') {
        const date = new Date(cellValue);
        context.dateFormatter ??= new Intl.DateTimeFormat(locale);
        return Number.isNaN(date.getTime()) ? cellValue : context.dateFormatter.format(date);
    }
    if (type === 'year') {
        const date = new Date(0);
        date.setFullYear(Number(cellValue), 0, 1);
        context.yearFormatter ??= new Intl.DateTimeFormat(locale, { year: 'numeric' });
        return Number.isNaN(date.getTime()) ? cellValue : context.yearFormatter.format(date);
    }
    if (type === 'bool') {
        return (cellValue) ? context.checkMark : context.xMark
    }

    return cellValue;
}
