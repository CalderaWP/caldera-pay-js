

// @flow
import React from 'react';
import {PriceTableItem} from "./PriceTableItem";
import type {Product} from "../../types";
type Props = {
	products: Array<Product>,
	callToAction: string,
	onSelectOption: Function
};

/**
 * Display Price table for a component
 *
 * @param props
 * @return {*}
 * @constructor
 */
export const PriceTables = (props: Props ) => {
	const {products,callToAction,onSelectOption} = props;
	return(
		<div>
			{products.map((product: Product) => {
				const {calderaPay} = product;

				const features=  [
					`Unlimited Form Submissions`,
					`Unlimited Forms`
				];
				if(calderaPay.bundle.includes.length ){
					features.push(`Includes ${calderaPay.bundle.includes.length} Add-ons`);
					features.push(`Includes Caldera Pro Service`)
				};

				const onSelectThisOption = () => { onSelectOption(product.id); };
				return (
					<React.Fragment key={product.id}>
						<PriceTableItem
							product={product}
							onSelectOption={onSelectThisOption}
							features={features}
							callToAction={callToAction}
						/>
					</React.Fragment>

				);
			})}
		</div>
	)
};

