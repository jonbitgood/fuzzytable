<script>
	import FuzzyTable from "$lib/FuzzyTable.svelte";
    import { onMount } from "svelte";

	let countries

	onMount(async () => {
		let countriesResponse = await fetch("/countries.json")
		countries = await countriesResponse.json()
		console.log(countries)
	});

	let t = {}
</script>
{#if countries}
<FuzzyTable data={countries} {t}
  head={[
    {	id: "tt", name: "Title", 
		link: {base: `https://find.bible/en/countries/`,id: 'id'},
		icon: {base: '/images/flags.svg#', id: 'id',}
	},
    {id: "po", name: "Population", type: "int", searchable:false, class: "text-center"},
    {id: "rn", name: "Region"},
    {id: "lc", name: "Languages", type: "int", searchable:false, class: "text-center hidden lg:table-cell"},
    {id: "pr", name: "Refugees", type: "int", searchable:false, class: "text-center hidden lg:table-cell"},
    {id: "pl", name: "Literacy Percentage", type: "int", searchable:false, suffix: '%', class: "text-center hidden lg:table-cell"},
]} />
{/if}