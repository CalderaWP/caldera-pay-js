// @flow
import React from 'react';
import type {Product} from "../types";

type Props = {
	productsInCart: Array<Product>,
	checkoutLink: string,
	onClose: Function
};

/**
 * Displays a message designed to be used right after adding to cart
 *
 * @todo add a messsage?
 *
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const BeforeCart = (props: Props) => {
	return (
		<div>
			<a
				href={props.checkoutLink}
			>
				Checkout  Now
			</a>
			<button
				onClick={props.onClose}
			>
				Continue
			</button>
			<div>Items In Cart: {props.productsInCart.length}</div>
		</div>
	);
};