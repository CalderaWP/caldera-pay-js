// @flow
import type {Product} from "../types";
import {inBundle, pickArray} from "../util";

export function orderProducts(bundles: Array<Product>, products: Array<Product>, bundleOrder: Array<string|number>) {
	let bundleMap = {};
	bundles.forEach((bundle) => {
		bundleMap[bundle.id] = products.filter(product => inBundle(product.id, bundle.calderaPay));
	});
	bundleMap['isFree'] = products.filter((product: Product) => product.calderaPay.prices.free);
	let ordered: Array<number> = [];

	/**
	 * Concact two arrays of numbers, adding ONLY unique values
	 * @param {(number)[]} currentValues Array to add to. All values of this array will remain.
	 * @param {(number)[]} newValues Values to add to current values. Only values NOT present in currentValues will be added.
	 * @return {(number)[]}
	 */
	const addToArrayUniqueNewOnly = (currentValues: Array<number>, newValues: Array<number>): Array<number> => {
		return Array.from(new Set(currentValues.concat(newValues)));
	};

	bundleOrder.forEach((key: number | string) => {
		ordered = addToArrayUniqueNewOnly(ordered, pickArray(bundleMap[key], 'id'));
	});
	return ordered;
}