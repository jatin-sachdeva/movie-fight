// the html code for the widget setup inside a divison named autocomplete
let war = {};
const autocomplete = {
	resultItemsStructure(movie) {
		const imgSrc = movie.Poster != 'N/A' ? movie.Poster : '';
		return `
		<img src="${imgSrc}">
		${movie.Title}
		`;
	},
	inputValue(movie) {
		return movie.Title;
	},
	async fetchData(searchValue) {
		const response = await axios.get('http://www.omdbapi.com/', {
			params: {
				apikey: 'be698af8',
				s: searchValue
			}
		});
		if (response.data.Error) return [];

		return response.data.Search;
	},
	compare() {
		console.log(war);
	}
};

createAutocomplete({
	...autocomplete,
	root: document.querySelector('#autocomplete-1'),
	async optionSelected(movie) {
		let compare = [];
		compare = await movieSelected(movie, document.querySelector('.displayResult-1 .card-content'));
		console.log(compare);
		war['dataFirst'] = compare;
	}
});
createAutocomplete({
	...autocomplete,
	root: document.querySelector('#autocomplete-2'),
	async optionSelected(movie) {
		let compare = [];
		compare = await movieSelected(movie, document.querySelector('.displayResult-2 .card-content'));
		console.log(compare);
		war['dataSecond'] = compare;
	}
});

async function movieSelected(movie, targetDiv) {
	const result = await fetchMovie(movie.Title);
	console.log(result);
	const rottenRating = result.Ratings[1];
	// console.log(rottenRating);
	const img = document.querySelector('.card-image img');
	console.log(img);
	img.src = result.Poster;

	const displayResult = targetDiv;
	displayResult.innerHTML = movieTemp(result);
	displayResult.classList.remove('none');
}
const movieTemp = (result) => {
	return `
		<div class="awards">
		<h2>${result.Awards}</h2>
    	</div>
		<div class="boxOffice">
		<h2>Box-Office</h2>
		<h2>${result.BoxOffice}</h2>
        </div>
        <div class="metaScore">
		<h2>Meta Score</h2>
		<h2>${result.Metascore}</h2>
    	</div>
		<div class="Ratings">
		<h2>IBDB rating</h2>
		<h2>${result.Ratings[0].Value}</h2>
    	</div>
`;
};
const fetchMovie = async (title) => {
	const response = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'be698af8',
			t: title
		}
	});
	return response.data;
};
