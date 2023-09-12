<script>
	import FuzzyTable from "$lib/FuzzyTable.svelte";
	let countries = [
    	{"id": "AD","tt": "Andorra","po": 85645,"rn": "Southern Europe","lc": 9,"pr": null,"pl": 99},
    	{"id": "AE","tt": "United Arab Emirates","po": 9856612,"rn": "Western Asia","lc": 46,"pr": 1247,"pl": 90},
    	{"id": "AF","tt": "Afghanistan","po": 37466414,"rn": "Southern Asia","lc": 66,"pr": 72228,"pl": 32},
    	{"id": "AG","tt": "Antigua and Barbuda","po": 99175,"rn": "Latin America and the Caribbean","lc": 4,"pr": null,"pl": 97},
    	{"id": "AL","tt": "Albania","po": 3088385,"rn": "Southern Europe","lc": 12,"pr": 128,"pl": 97}
	]

	let t = {}

</script>

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
