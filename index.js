const fetchData = async function(searchValue) {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'be698af8',
			s: searchValue
		}
	});
	if (response.data.Error) return [];

	return response.data.Search;
};

// the html code for the widget setup inside a divison named autocomplete
const autocomplete = document.querySelector('.autocomplete');
autocomplete.innerHTML = `
	<label for="search"> Search a Movie </label>
	
	<div class="dropdown">
	<input type="text" id="search"/>
		<div class ="dropdown-menu">
			<div class ="dropdown-content results">
			</div>
		</div>
	</div>
`;

const search = document.querySelector('#search');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

async function onInput(event) {
	const movies = await fetchData(event.target.value);
	// checking if no results are present inside movies
	if (!movies.length) return;
	dropdown.classList.add('is-active');
	// clearing the previous search results
	resultsWrapper.innerHTML = null;
	// iterating the movie to display title and image

	for (let movie of movies) {
		// creating element for every returned result and apprnding it to the divison
		const resultsItems = document.createElement('a');
		resultsItems.classList.add('dropdown-item');
		const imgSrc = movie.Poster != 'N/A' ? movie.Poster : '';

		resultsItems.innerHTML = `
		<img src="${imgSrc}">
		${movie.Title}
		`;
		// resultsItems.addEventListener('click', (event) => {
		// 	search.value = event.target.innerText;
		// 	dropdown.classList.remove('is-active');
		// });
		resultsItems.addEventListener('click', movieSelected);
		resultsWrapper.appendChild(resultsItems);
	}
}

async function movieSelected(event) {
	search.value = event.target.innerText;
	dropdown.classList.remove('is-active');
	const result = await fetchMovie(search.value);
	console.log(result);
	const rottenRating = result.Ratings[0];
	const boxOffice = result.boxOffice;

	const image = document.querySelector('.card-image img');
	const cardContent = document.querySelector('.card-content');
	image.src = result.Poster;
}

const fetchMovie = async (title) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'be698af8',
			t: title
		}
	});
	return response.data;
};

search.addEventListener('input', debounce(onInput, 500));

document.addEventListener('click', (event) => {
	// .contains check whether the passed element(passed inside of .includes) is child of the targeted element(on which the method is applied)
	autocomplete.contains(event.target) ? '' : dropdown.classList.remove('is-active');
});
