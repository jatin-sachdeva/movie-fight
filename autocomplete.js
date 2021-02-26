// here we will have the code that can be reused to create more no of autocompletes
// the functtion will recieve a config object
// the config object will have the configuration of what is specific to that creation
const createAutocomplete = (config) => {
	const { root, resultItemsStructure, optionSelected, inputValue, fetchData } = config;
	root.innerHTML = `
	<label for="search"> Search a Movie </label>
	
	<div class="dropdown">
	<input type="text" />
		<div class ="dropdown-menu">
			<div class ="dropdown-content results">
			</div>
		</div>
	</div>
`;

	const search = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	async function onInput(event) {
		const items = await fetchData(event.target.value);
		// checking if no results are present inside items
		if (!items.length) return;
		dropdown.classList.add('is-active');
		// clearing the previous search results
		resultsWrapper.innerHTML = null;
		// iterating the movie to display title and image

		for (let item of items) {
			console.log(item);
			// creating element for every returned result and apprnding it to the divison
			const resultsItems = document.createElement('a');
			resultsItems.classList.add('dropdown-item');
			// now to have a result displayed in dropdown
			// a function is called that has the config of what and how to be displayed
			resultsItems.innerHTML = resultItemsStructure(item);

			resultsItems.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				search.value = inputValue(item);

				optionSelected(item);
			});
			resultsWrapper.appendChild(resultsItems);
		}
	}
	search.addEventListener('input', debounce(onInput, 500));
	// closing dropdown when any element other than the one inside the autocomplete divison is clicked
	document.addEventListener('click', (event) => {
		// .contains check whether the passed element(passed inside of .contains) is child of the targeted element(on which the method is applied)
		root.contains(event.target) ? '' : dropdown.classList.remove('is-active');
	});
};
