// @flow
import React from 'react';
import type {Product} from "../../types";

type Props = {
	product: Product,
	onSelectOption ?: Function,
	features: Array<string>,
	callToAction ?: string,
	buttonClassName?: string,
	showPurchase ?: boolean
};

/**
 * Displays ONE item in a price table
 *
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const PriceTableItem = (props: Props) => {
	const {product, onSelectOption, features, callToAction, buttonClassName,showPurchase} = props;
	const {calderaPay} = product;

	return (
		<div>
			<h3>{product.title.rendered}</h3>
			<ul>
				{features.map((feature: string) => {
					return <li
						key={feature.replace(/\W/g, '')}
					>
						{feature}
					</li>
				})}
			</ul>
			<div>{calderaPay.prices.price}</div>
			{showPurchase &&
				<button
					className={buttonClassName}
					onClick={onSelectOption}
				>
					{callToAction}
				</button>
			}
		</div>
	)
};
