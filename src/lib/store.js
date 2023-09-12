import { writable, derived } from "svelte/store";
import Fuse from "fuse.js";

// Define the initial state for the store
const fuzzyState = {
	data: [],
	head: [],
	query: "",
	filters: [],
	sortedCol: "",
	start: 0,
	size: 10,
	current_page: 0,
	page_sizes: [10, 100, 250, 500, 1000],
	table: [],
};

// Create the store
const store = writable(fuzzyState);

// Derived store for Fuse.js
export const fuse = derived(
	store,
	($store) =>
		new Fuse($store.data, {
			shouldSort: true,
			includeMatches: true,
			threshold: 0.3,
			location: 0,
			distance: 50,
			maxPatternLength: 12,
			minMatchCharLength: 1,
			keys: $store.head
				.filter((column) => column.searchable !== false)
				.map((column) => column.id),
		}),
);

// Export the store
export default store;
