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
		movieSelected(movie, document.querySelector('.displayResult-1'));
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
	const res = await axios.get('http://www.omdbapi.com/', {
		params: {
			apikey: 'be698af8',
			t: movie.Title
		}
	});
	const result = res.data;
	const img = targetDiv.querySelector('.card-image img');
	// console.log(img);
	img.src = result.Poster;
	const displayResult = targetDiv.querySelector('.card-content');
	displayResult.innerHTML = movieTemp(result);
	displayResult.classList.remove('none');

	// code for storing the response for comparing purposes
	if (targetDiv.classList.value.includes('2')) {
		rightData = result;
	}
	if (targetDiv.classList.value.includes('1')) {
		leftData = result;
	}
	if (leftData && rightData) {
		startCompare();
	}
}
function startCompare() {
	// select the two targeted elements
	const leftStats = document.querySelectorAll('.displayResult-1 .card-content div');
	const rightStats = document.querySelectorAll('.displayResult-2 .card-content div');
	console.log(leftStats, rightStats);

	// comparing them
	leftStats.forEach((lCurr, ind) => {
		const rvalue = rightStats[ind];
		const lvalue = leftStats[ind];
		console.log(rvalue.dataset.value, lvalue.dataset.value);
		if (parseInt(rvalue.dataset.value) > parseInt(lvalue.dataset.value)) {
			lvalue.setAttribute('style', 'background-color:yellow');
			rvalue.setAttribute('style', 'background-color:green');
		} else {
			rvalue.setAttribute('style', 'background-color:yellow');
			lvalue.setAttribute('style', 'background-color:green');
		}
	});
}
const movieTemp = (result) => {
	const collection = result.BoxOffice.slice(1).replace(/,/g, '');
	const imdb = parseFloat(result.Ratings[0].Value.slice(0, 3));
	const meta = parseInt(result.Metascore);
	const votes = parseInt(result.imdbVotes.replace(/,/g, ''));
	const award = result.Awards.split(' ').reduce((acc, curr) => {
		// console.log(parseInt(curr));
		if (parseInt(curr)) {
			return acc + parseInt(curr);
		} else {
			return acc;
		}
	}, 0);
	// console.log(collection, imdb, meta, votes, award);
	return `
		<div data-value=${award} class="awards">
		<h2>${result.Awards}</h2>
    	</div>
		<div data-value=${collection} class="boxOffice">
		<h2>Box-Office</h2>
		<h2>${result.BoxOffice}</h2>
        </div>
        <div data-value=${meta} class="metaScore">
		<h2>Meta Score</h2>
		<h2>${result.Metascore}</h2>
    	</div>
		<div data-value=${imdb} class="Ratings">
		<h2>IBDB rating</h2>
		<h2>${result.Ratings[0].Value}</h2>
    	</div>
		<div data-value=${votes} class="votes">
		<h2>IMDB votes</h2>
		<h2>${result.imdbVotes}</h2>
    	</div>
`;
};
