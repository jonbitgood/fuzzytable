import { elem } from './FuzzyTableHelper.js';

/**
 * Creates a UI component for downloading data in JSON, TSV, CSV, or Excel format.
 * This component toggles a table download filetype options dropdown.
 * @param {Object} context - The context object for passed in options
 * @returns {HTMLElement} - The details HTMLElement for the downloads
 */
export default function createDownloadUI(context) {
    const details = elem('details', {id: 'fuzzy_download_details', className: context.classes.downloadWrapper});
    const summary = elem('summary', {className: context.classes.downloadButton});
  
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('stroke-width', '1.5');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('class', 'w-6 h-6');
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />';
    summary.appendChild(icon);
  
    const dropdown = elem('div', {
      className: context.classes.downloadDropdown,
      innerHTML: `<p class="${context.classes.downloadDropdownInfo}">(Download current filtered dataset)</p>`
    });
  
    for (const type of ['CSV', 'Excel', 'TSV', 'JSON']) {
      const button = elem('button', {
        className: context.classes.downloadDropdownButton,
        textContent: type,
        onclick: () => downloadData(context.table, type)
      });
      dropdown.appendChild(button);
    }
  
    details.appendChild(summary);
    details.appendChild(dropdown);
  
    document.addEventListener('click', (event) => {
      if (!details.contains(event.target) && details.hasAttribute('open')) {
        details.removeAttribute('open');
      }
    });
  
    return details;
}

/**
 * Triggers a download of the table data in JSON, TSV, CSV, or Excel format.
 * This function creates a Blob from the data and uses a temporary download link to initiate the download.
 *
 * @param {Array} data - The array of data objects to be downloaded.
 * @param {string} type - The type of file to generate: "JSON", "TSV", "CSV", or "Excel"
 */
function downloadData(data, type) {

    const convertArrayToSeparatedValues = (data, separator) => {
        const headings = Object.keys(data[0]).join(separator);
        const rows = data.map(row => Object.values(row).join(separator)).join('\n');
        return `${headings}\n${rows}`;
    };

    let fileType;
    let fileName;
    let fileContent;

    switch (type) {
        case 'TSV':
            fileType = 'text/tab-separated-values';
            fileName = 'data.tsv';
            fileContent = convertArrayToSeparatedValues(data, '\t');
            break;
        case 'CSV':
            fileType = 'text/csv';
            fileName = 'data.csv';
            fileContent = convertArrayToSeparatedValues(data, ',');
            break;
        case 'Excel':
            fileType = 'application/vnd.ms-excel';
            fileName = 'data.xls';
            fileContent = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table><thead><tr>${Object.keys(data[0]).map(k=>`<th>${k}</th>`).join``}</tr></thead><tbody>${data.map(r=>`<tr>${Object.values(r).map(v=>`<td>${v}</td>`).join``}</tr>`).join``}</tbody></table></body></html>`;
            break;
        default:
            fileType = 'application/json';
            fileName = 'data.json';
            fileContent = JSON.stringify(data, null, 2);
            break;
    }

    const blob = new Blob([fileContent], { type: fileType });
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}