// @flow
import React from 'react';
import type {Product} from "../types";

type Props = {
	productsInCart: Array<Product>,
	checkoutLink: string
};

/**
 * Displays product cart
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const Cart = (props: Props) => {
	return (
		<div>
			<div>Items In Cart: {props.productsInCart.length}</div>
			{props.productsInCart.length &&
				<div><a href={props.checkoutLink}>Checkout</a></div>
			}
		</div>
	);
};
