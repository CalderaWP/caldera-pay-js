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
		<div className="panel price panel-orange">
			<div className="panel-heading arrow_box text-center">
				<h3>{product.title.rendered}</h3>
				<strong>{calderaPay.prices.price}</strong>
				<ul
					className={"list-group list-group-flush text-center"}
				>
					{features.map((feature: string) => {
						return <li
							className={"list-group-item"}
							key={feature.replace(/\W/g, '')}
						>
							<span>{feature}</span>
						</li>
					})}
				</ul>

				{showPurchase &&
					<div className="panel-footer">
						<a
							style={{width: '100%'}}
							className={buttonClassName}
							onClick={onSelectOption}
						>
							{callToAction}
						</a>
					</div>
				}
			</div>
		</div>
	)
};
