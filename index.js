// the html code for the widget setup inside a divison named autocomplete

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
	}
};

createAutocomplete({
	...autocomplete,
	root: document.querySelector('#autocomplete-1'),
	async optionSelected(movie) {
		await movieSelected(movie, document.querySelector('.displayResult-1'));
	}
});
createAutocomplete({
	...autocomplete,
	root: document.querySelector('#autocomplete-2'),
	async optionSelected(movie) {
		movieSelected(movie, document.querySelector('.displayResult-2'));
	}
});
let leftData;
let rightData;
async function movieSelected(movie, targetDiv) {
	console.log(movie.Title);
	const result = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'be698af8',
			t: movie.Title
		}
	});
	const img = targetDiv.querySelector('.card-image img');
	console.log(img);
	img.src = result.Poster;
	const displayResult = targetDiv.querySelector('.card-content');
	displayResult.innerHTML = movieTemp(result);
	displayResult.classList.remove('none');

	// code for storing the response for comparing purposes
	if (targetDiv.includes('1')) {
		left = result.data;
	} else {
		right = result.data;
	}
	if (leftData && rightData) {
		startCompare(leftData, rightData);
	}
	const startCompare = (left, right) => {
		console.log(left, right);
	};
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
