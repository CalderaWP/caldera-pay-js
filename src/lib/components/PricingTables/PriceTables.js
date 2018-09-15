// @flow
import React from 'react';
import {PriceTableItem} from "./PriceTableItem";
import type {Product,CalderaPayProductInfo} from "../../types";
type Props = {
	products: Array<Product>,
	callToAction: string,
	onSelectOption: Function
};

/**
 * Get an array of product features
 *
 * @param calderaPay
 * @return {string[]}
 */
export function productFeatures(calderaPay: CalderaPayProductInfo) : Array<string>{
	const features = [
		`Unlimited Form Submissions`,
		`Unlimited Forms`
	];

	if (calderaPay.bundle.includes.length) {
		features.push(`Includes ${calderaPay.bundle.includes.length} Add-ons`);
		features.push(`Includes Caldera Pro Service`)
	}

	return features;
}

/**
 * Display Price table for a component
 *
 * @param props
 * @return {*}
 * @constructor
 */
export const PriceTables = (props: Props ) => {
	const {products,callToAction,onSelectOption} = props;
	const colWidth = 12/products.length;
	const classNameForColumn = `col-sm-12 col-md-${colWidth}`;
	return(
		<div className={'row'}>
			{products.map((product: Product) => {
				const {calderaPay} = product;

				const features = productFeatures(calderaPay);

				const onSelectThisOption = () => { onSelectOption(product.id); };

				return (
					<div
						key={product.id}
						className={classNameForColumn}
					>
						<PriceTableItem
							product={product}
							onSelectOption={onSelectThisOption}
							features={features}
							callToAction={callToAction}
							showPurchase={true}
						/>
					</div>

				);
			})}
		</div>
	)
};

