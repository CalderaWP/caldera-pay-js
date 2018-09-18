/**
 * Get HTML element by ID in a way that Flow will not raise errors
 * @see https://stackoverflow.com/a/44979814/1469799

 *
 * @param {String} id
 * @return {HTMLElement}
 */
export const getElement = (id:string) : Element => {
	const el = document.getElementById(id);
	if(el && el.offsetWidth) {
		return el;
	}
	throw {error: 'Missing element'}
};