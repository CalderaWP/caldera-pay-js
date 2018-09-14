// @flow
import React from 'react';
import type {Product} from "../../types";
type Props = {
	product: Product,
	onSelectOption: Function,
	features: Array<string>,
	callToAction: string
};
export const PriceTableItem = (props: Props ) => {
	const {product,onSelectOption,features,callToAction} = props;
	const {calderaPay} = product;
	return(
		<div>
			<h3>{product.title.rendered}</h3>
			<ul>
				{features.forEach((feature:string) => {
					return <li>feature</li>
				})}
				<li>Includes {calderaPay.bundle.includes.length} Add-ons</li>
				<li>Includes Caldera Pro Service</li>
			</ul>
			<button
				onClick={onSelectOption}
			>
				{callToAction}
			</button>
		</div>
	)
}

