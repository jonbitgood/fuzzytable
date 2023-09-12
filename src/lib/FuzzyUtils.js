export function sortByValueString(array, property) {
	return array.sort((a, b) => {
		const valueA = a[property] ?? "";
		const valueB = b[property] ?? "";
		return valueA.localeCompare(valueB);
	});
}
