import { writable, derived } from "svelte/store";
import Fuse from "fuse.js";

// Create the store
export const fuzzy = writable({
	data: [],
	filteredTable: [],
	head: [],
	query: "",
	filters: [],
	sortedCol: "",
	start: 0,
	size: 100,
	current_page: 0,
	page_sizes: [100, 150, 500, 1000, 5000],
	table: [],
});


export const pages = derived(
    [fuzzy], 
    ([$fuzzy]) => {
        const numPages = Math.ceil($fuzzy.table.length / $fuzzy.size);
        return Array.from({ length: numPages }, (_, index) => index);
    }
);

// Derived store for Fuse.js
export const fuse = derived(
	fuzzy,
	($fuzzy) =>
		new Fuse($fuzzy.filteredTable, {
			shouldSort: true,
			includeMatches: true,
			threshold: 0.3,
			location: 0,
			distance: 50,
			maxPatternLength: 12,
			minMatchCharLength: 1,
			keys: $fuzzy.head
				.filter((column) => column.searchable !== false)
				.map((column) => column.id),
		}),
);
