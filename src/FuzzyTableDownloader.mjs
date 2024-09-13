/**
 * Creates a UI component for downloading data in JSON or TSV format.
 * This component consists of a details element that toggles visibility
 * of download options on click and closes if clicked outside.
 *
 * @param {Object} context - The context object containing the FuzzyTable
 * @returns {HTMLElement} - The details element containing the downloadable options.
 */
export default function createDownloadUI(context) {
    const types = ['JSON', 'TSV'];

    const details = document.createElement('details');
    details.className = 'relative';
    details.id = 'fuzzy_download_details';

    const summary = document.createElement('summary');
    summary.className = context.classes.downloadButton;

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('stroke-width', '1.5');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('class', 'w-6 h-6');
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />';
    summary.appendChild(icon);

    const dropdown = document.createElement('div');
    dropdown.className = context.classes.downloadDropdown;
    dropdown.innerHTML = `<p class="${context.classes.downloadDropdownInfo}">(Download current filtered dataset)</p>`;

    for (const type of types) {
        const button = document.createElement('button');
        button.className = context.classes.downloadDropdownButton;
        button.textContent = type;
        button.onclick = () => downloadData(context.table, type);
        dropdown.appendChild(button);
    }

    details.appendChild(summary);
    details.appendChild(dropdown);

    // Add event listener to close the details element if clicked outside
    document.addEventListener('click', (event) => {
        if (!details.contains(event.target) && details.hasAttribute('open')) {
            details.removeAttribute('open');
        }
    });

    return details;
}


/**
 * Triggers a download of the table data in either JSON or TSV format.
 * This function creates a Blob from the data and uses a temporary download link to initiate the download.
 *
 * @param {Array} data - The array of data objects to be downloaded.
 * @param {string} type - The type of file to generate: "JSON" or "TSV".
 */
function downloadData(data, type) {
    const convertArray2TSV = (data) => {
        const headings = Object.keys(data[0]).join('\t');
        const rows = data.map(row => Object.values(row).join('\t')).join('\n');
        return `${headings}\n${rows}`;
    };

    const isTSV = type === 'TSV';
    const fileType = isTSV ? 'text/tsv' : 'application/json';
    const fileName = isTSV ? 'data.tsv' : 'data.json';
    const fileContent = isTSV ? convertArray2TSV(data) : JSON.stringify(data);

    const blob = new Blob([fileContent], { type: fileType });

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
