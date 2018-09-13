// @flow
import React from 'react';
import type {Product} from "../types";
import classNames from "classnames";

type Props = {
	productsInCart: Array<Product>,
};

/**
 * Displays product cart
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const CartContentsTable = (props: Props) => {
	const {productsInCart} = props;
	return (
		<table
			className={classNames([
				'striped', 'bordered', 'condensed', 'hover', 'table'
			])}
		>
			<thead>
			<tr>
				<th>
					Name
				</th>
				<th>
					Price
				</th>
				<th>
					Action
				</th>

			</tr>
			</thead>
			<tbody>
				{
					productsInCart.forEach((product: Product) => {
						const {calderaPay} = product;
						console.log(calderaPay);
						return (
							<tr
								key={product.id}
							>
								<th>
									<img
										src={calderaPay.featuredImage.url}
										alt={product.title.rendered}
									/>
								</th>
								<th>
									{calderaPay.price}
								</th>
								<th>Remove</th>
							</tr>
						)

					})
				}
			</tbody>
		</table>

	);
};
