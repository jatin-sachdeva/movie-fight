function debounce(func, delay) {
	let timeoutId;
	return (...args) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			func.apply(null, args); // in apply args are passed as an array that is why in line 3 the func first uses
			// rest operator and then that is passed into fun
		}, delay);
	};
}
