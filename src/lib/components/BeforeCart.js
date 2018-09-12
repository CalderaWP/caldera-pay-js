// @flow
import React from 'react';
import type {Product} from "../types";
import {Button} from '@wordpress/components';

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
				Checkout Now
			</a>
			<Button
				onClick={props.onClose}
			>
				Continue
			</Button>
			<div>Items In Cart: {props.productsInCart.length}</div>
		</div>
	);
};