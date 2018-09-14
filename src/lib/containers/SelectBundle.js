// @flow
import React from 'react';
import {PriceTables} from "../components/PricingTables/PriceTables";
import type{Product} from "../types/index";

type Props = {
	product: Product,
	bundlesIncludedIn: ?Array<Product>,
	onSelectForPurchase: Function
}

/**
 * Select Bundle Step
 *
 * Small wrapper around price table, merging product and bundles
 * @param props
 * @return {*}
 * @constructor
 */
export const SelectBundle = (props : Props ) => {
	const {product,bundlesIncludedIn,onSelectForPurchase} = props;
	const productsForPriceTable = [product].concat(bundlesIncludedIn);
	const callToAction = 'Purchase';

	return(
		<div className={'price-table'}>
			<PriceTables
				products={productsForPriceTable}
				callToAction={callToAction}
				onSelectOption={onSelectForPurchase}
			/>
		</div>
	);
}