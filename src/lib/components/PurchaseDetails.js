import React from 'react';
import type {Product } from "../types";
import {PriceTableItem} from "./PricingTables/PriceTableItem";
import {productFeatures} from "./PricingTables/PriceTables";

type Props = {
	product: Product,
	heading: string
}


export const PurchaseDetails = (props:Props ) => {
	const {product,heading} = props;
	const features = productFeatures(product.calderaPay);
	return(
		<div>
			<h2>{heading}</h2>
			<PriceTableItem
				product={product}
				features={features}
			/>
		</div>
	)
}