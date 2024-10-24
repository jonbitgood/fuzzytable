# FuzzyTable

A headless compatible data-table with tailwind defaults built with vanilla javascript and fuzzy search powered by fuse.js 

## Quick Start

### CDN

```
<script src="https://cdn.jsdelivr.net/npm/fuzzytable@latest/dist/FuzzyTable.js"></script>
```

### Install with NPM

```
npm i fuzzytable
```

## Configure

### Styles

Every element in fuzzy-table can be configured with your own custom styles, while they default to tailwind classes they can be easily overwritten by passing in a custom object in the fuzzy-table init.
```
const classesOverride = {
    pagination: 'CustomPagination',
    sortArrow: 'CustomSortArrow',
    arrowUp: 'CustomArrowUp',
    arrowDown: 'CustomArrowDown',
    paginationButton: 'CustomPaginationButton',
    paginationButtonCurrent: 'CustomPaginationButtonCurrent',
    paginationNav: 'CustomPaginationNav',
    downloadButton: 'CustomDownloadButton',
    downloadDropdown: 'CustomDownloadDropdown',
    downloadDropdownButton: 'CustomDownloadDropdownButton',
    downloadDropdownInfo: 'CustomDownoadDropdownInfo',
    fieldsetWrap: 'CustomFieldsetWrap',
    fieldsetFilterWrap: 'CustomFieldsetFilterWrap',
    fieldset: 'CustomFieldset',
    filterContainer: 'CustomFilterContainer',
    filterButton: 'CustomFilterButton',
    filterButtonActive: 'CustomFilterButtonActive',
    tableContainer: 'CustomTableContainer',
    tableColumn: 'CustomTableColumn',
    searchInput: 'CustomSearchInput',
    searchIcon: 'CustomSearchIcon',
    searchWrapper: 'CustomSearchWrapper',
    sizeSelectContainer: 'CustomSizeSelectContainer',
    sizeSelect: 'CustomSizeSelect',
    tableHeader: 'CustomTableHeader',
    tableCellLink: 'CustomTableCellLink',
    table: 'CustomTable',
    thead: 'CustomThead',
    tbody: 'CustomTbody',
    th: 'CustomTh',
    tr: 'CustomTr',
    td: 'CustomTd',
};
new FuzzyTable('FuzzyTableWapper', data, head, {
    classes: classesOverride,
    t: {search_placeholder: 'Search'},
    locale: 'en'
});
```

### Options

```
const head = [
    { id: "name", name: "دولة", link: { base: `https://en.wikipedia.org/wiki/ISO_3166-2:`, id: 'id' }, icon: { base: '/demo/flags.svg#', id: 'id', class: "h-5 w-5 drop-shadow-md inline-block ml-3" } },
    { id: "population", name: "سكان", type: "int", searchable: false, class: "text-right" },
    { id: "region_name", name: "منطقة", class: "hidden sm:table-cell" },
    { id: "official_language", name: "لغة", searchable: false, class: "text-center hidden lg:table-cell" },
    { id: "id", name: "id", class: "hidden" },
    { id: "landmass_km", name: "مساحة اليابسة", type: "int", searchable: false, suffix: '<span>كم<sup class="">٢</sup> </span>', class: "text-right hidden lg:table-cell" },
];
const customFilters = [{
    name: "المناطق", filterType: 'radio', filterColumn: "id", iconSprite: '/demo/continents.svg#', options: [
        { code: '', title: 'الجميع', value: /.+/, active: true },
        { code: 'AF', title: 'أفريقيا', value: /AO|BF|BI|BJ|BW|CD|CF|CG|CI|CM|CV|DJ|DZ|EG|EH|ER|ET|GA|GH|GM|GN|GQ|GW|KE|KM|LR|LS|LY|MA|MG|ML|MR|MU|MW|MZ|NA|NE|NG|RE|RW|SC|SD|SH|SL|SN|SO|SS|ST|SZ|TD|TG|TN|TZ|UG|YT|ZA|ZM|ZW/ },
        { code: 'AS', title: "آسيا", value: /AE|AF|AM|AZ|BD|BH|BN|BT|CC|CN|CX|GE|HK|ID|IL|IN|IO|IQ|IR|JO|JP|KG|KH|KP|KR|KW|KZ|LA|LB|LK|MM|MN|MO|MV|MY|NP|OM|PH|PK|PS|QA|SA|SG|SY|TH|TJ|TM|TR|TW|UZ|VN|YE/ },
        { code: 'EU', title: "أوروبا", value: /AD|AL|AT|AX|BA|BE|BG|BY|CH|CY|CZ|DE|DK|EE|ES|FI|FO|FR|GB|GG|GI|GR|HR|HU|IE|IM|IS|IT|JE|LI|LT|LU|LV|MC|MD|ME|MK|MT|NL|NO|PL|PT|RO|RS|RU|SE|SI|SJ|SK|SM|UA|VA|XK/ },
        { code: 'NA', title: "أمريكا الشمالية", value: /AG|AI|AW|BB|BL|BM|BQ|BS|BZ|CA|CR|CU|CW|DM|DO|GD|GL|GP|GT|HN|HT|JM|KN|KY|LC|MF|MQ|MS|MX|NI|PA|PM|PR|SV|SX|TC|TT|US|VC|VG|VI/ },
        { code: 'SA', title: "أمريكا الجنوبية", value: /AR|BO|BR|CL|CO|EC|FK|GF|GY|PE|PY|SR|UY|VE/ },
        { code: 'OC', title: "أوقيانوسيا", value: /AS|AU|CK|FJ|FM|GU|KI|MH|MP|NC|NF|NR|NU|NZ|PF|PG|PN|PW|SB|TK|TL|TO|TV|UM|VU|WF|WS/ }
    ]
},
{
    name: "إقليم", filterType: 'radio', filterColumn: "id", options: [
        { code: '', title: 'الجميع', value: /.+/, active: true },
        { code: 'NT', title: 'أمة', value: /AD|AE|AF|AG|AL|AM|AO|AR|AT|AU|AZ|BA|BB|BD|BE|BF|BG|BH|BI|BJ|BN|BO|BR|BS|BT|BW|BY|BZ|CA|CD|CF|CG|CH|CI|CL|CM|CN|CO|CR|CU|CV|CY|CZ|DE|DJ|DK|DM|DO|DZ|EC|EE|EG|EH|ER|ES|ET|FI|FJ|FM|FR|GA|GB|GD|GE|GH|GM|GN|GQ|GR|GT|GW|GY|HN|HR|HT|HU|ID|IE|IL|IN|IQ|IR|IS|IT|JM|JO|JP|KE|KG|KH|KI|KM|KN|KP|KR|KW|KZ|LA|LB|LC|LI|LK|LR|LS|LT|LU|LV|LY|MA|MC|MD|ME|MG|MH|MK|ML|MM|MN|MR|MT|MU|MV|MW|MX|MY|MZ|NA|NE|NG|NI|NL|NO|NP|NR|NZ|OM|PA|PE|PG|PH|PK|PL|PS|PT|PW|PY|QA|RO|RS|RU|RW|SA|SB|SC|SD|SE|SG|SI|SK|SL|SM|SN|SO|SR|SS|ST|SV|SY|SZ|TD|TG|TH|TJ|TL|TM|TN|TO|TR|TT|TV|TW|TZ|UA|UG|US|UY|UZ|VA|VC|VE|VN|VU|WS|YE|ZA|ZM|ZW/ },
        { code: 'TR', title: 'إِقلِيم', value: /AI|AS|AW|AX|BL|BM|BQ|BV|CC|CK|CW|CX|FK|FO|GF|GG|GI|GL|GP|GS|GU|HK|HM|IM|IO|JE|KD|KY|MF|MO|MP|MQ|MS|NC|NF|NU|PF|PM|PN|PR|RE|SH|SJ|SX|TC|TF|TK|UM|VG|VI|WF|XK|YT|ZZ/ }
    ]
}]

const options = {
    filters: customFilters,
    pageSize: 50,
    pageSizes: [25,50,500,1000],
    classes: '',
    locale: 'zh-u-nu-hanidec',
    t: {search_placeholder: 'fuzzy filter'},
    vernacularNumerals: '',
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('countries.json').then(reply => reply.json())
        .then(data => {new FuzzyTable('FuzzyTableWapper', data, head, options});
    })
})
```

