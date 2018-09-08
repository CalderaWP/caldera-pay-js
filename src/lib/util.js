import type {CalderaPayProductInfo} from "./types";


/**
 * Check if a product is in a bundle
 * @param {Number}productId
 * @param {CalderaPayProductInfo}bundleProductInfo
 * @return {Boolean}
 */
export const inBundle = (productId: number, bundleProductInfo: CalderaPayProductInfo) : boolean => {
	const bundledDownloads = bundleProductInfo.bundle.includes.map((value: string): number => { return parseInt(value,10)});
	return bundledDownloads.includes(parseInt(productId,10));
};

/**
 * Get the intersection of two numeric arrays
 *
 * @see https://stackoverflow.com/a/37041756/1469799
 *
 * @param {number[]} arrayOne First array
 * @param {number[]} arrayTwo Second array
 * @return {number[]}
 */
export const intersect = (arrayOne: Array<number>, arrayTwo: Array<number>) :  Array<number>  => {
	return [...new Set(arrayTwo)].filter(x => new Set(arrayTwo).has(x));
};

//This is copied from caldera-admin. Choose one location.
export const pickArray = (array, key) => {
	return array.reduce(
		(accumualtor, item) =>
			accumualtor.concat([item[key]]), []
	);
};