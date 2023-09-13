<h1 align="center"><img width="40px" src="/static/table.svg" />Fuzzytable</h1>

A simple DataTable with built in fuzzy finding using fuse.js, tailwind, and svelte

## Install

```
npm install fuzzytable
```

## Quickstart
```
import FuzzyTable from 'FuzzyTable'
```

## Structure

The Data structure going into the table is defined in the head param, each element of the array has 5 options:
- **id**: The name of the key from which to pull data for this column 
- **name**: The presentation value
- **searchable**: value to disable search
- **class**: classes to add to the column
- **link**: a.href to wrap the row element
	- **base**: the prefix path upon which the id is appended
	- **id**: The name of the key from which to pull data for this link
- **icon**: 
	- **base**: the prefix path upon which the id is appended
	- **id**: The name of the key from which to pull data for this icon

```html
<FuzzyTable data={countries} {t}
  head={[
    {	id: "tt", name: "Title", 
		link: {base: `/countries`,id: 'id'},
		icon: {base: '/images/flags.svg#', id: 'id'}
	},
    {id: "po", name: "Population", type: "int", searchable:false, class: "text-center"},
    {id: "rn", name: "Region"},
    {id: "lc", name: "Languages", type: "int", searchable:false, class: "text-center hidden lg:table-cell"},
    {id: "pr", name: "Refugees", type: "int", searchable:false, class: "text-center hidden lg:table-cell"},
    {id: "pl", name: "Literacy Percentage", type: "int", searchable:false, suffix: '%', class: "text-center hidden lg:table-cell"},
]} />
```