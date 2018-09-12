// @flow
import {Component} from "react";
import React from "react";
import type {Product} from "../types";



type Props = {
	product: Product,
	bundle: ?Product,
	isIncluded: boolean,
	onAddToCart: Function
}

type State = {
	hovered: boolean,
}

const NotIncluded = ()=> {
	return (
		<React.Fragment>
			<i
				className="fa fa-times"
				aria-hidden="true"
			>
				<span className={'sr-only'}>Not Included</span>
			</i>
		</React.Fragment>
	);

};

const NotHovered = (props: Props ) => {
	return (
		<React.Fragment>

			<i
				className="fa fa-check"
				aria-hidden="true"
			>
				<span className={'sr-only'}>Hover For More Information</span>
			</i>
		</React.Fragment>
	);
};



const Hovered = ( props: Props ) => {
	const addToCart = () => {
		props.onAddToCart(props.product.id);
	};

	return (
		<React.Fragment>
			<button
				title={'Click For Purchase Options'}
				onClick={addToCart}
			>
				<i
					className="fa fa-plus-circle"
					aria-hidden="true"
				>
				</i>
			</button>
		</React.Fragment>
	);

};

export class ProductCell extends Component<Props, State> {
	props: Props;

	state: State = {
		hovered: false,
	};

	handleMouseEnter: Function = (event: Event): void => {
		this.setState({ hovered: true })

	};

	handleMouseLeave: Function = (event: Event): void => {
		this.setState({ hovered: false });

	};


	render()
	{
		const {
			product,
			bundle,
			isIncluded,
			onAddToCart
		} = this.props;
		const {hovered} = this.state;
		if( ! isIncluded ){
			return(
				<th>
					<NotIncluded />
				</th>
			);

		}
		return (
			<th
				onMouseEnter={ this.handleMouseEnter }
				onMouseLeave={ this.handleMouseLeave }

			>
				{hovered &&
					<Hovered
						product={product}
						bundle={bundle}
						isIncluded={isIncluded}
						onAddToCart={onAddToCart}
					/>
				}

				{! hovered &&
					<NotHovered
						product={product}
						bundle={bundle}
						isIncluded={isIncluded}
						onAddToCart={onAddToCart}
					/>
				}
			</th>
		)
	}
}