

// @flow
import React from 'react';
import {PriceTableItem} from "./PriceTableItem";
import type {Product} from "../../types";
type Props = {
	products: Array<Product>,
	callToAction: string,
	onSelectOption: Function
};
export const PriceTable = (props: Props ) => {
	const {products,callToAction,onSelectOption} = props;
	return(
		<div>
			{products.forEach((product: Product) => {
				const {calderaPay} = product;

				const features=  [
					`Includes ${calderaPay.bundle.includes.length} Add-ons`,
					`Includes Caldera Pro Service`
				];
				return <PriceTableItem
					product={product}
					onSelectOption={onSelectOption}
					features={features}
					callToAction={callToAction}
				/>
			})}
		</div>
	)
};

