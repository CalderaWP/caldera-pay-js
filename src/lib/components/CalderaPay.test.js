import  {CalderaPay} from "./CalderaPay";
import React from "react";
import renderer from "react-test-renderer";
import {ProductGrid} from "./ProductGrid";
import {BeforeCart} from "./BeforeCart";
import {orderProducts} from "../util/orderProducts";
import {ProductSearch} from "./ProductSearch";
import type {Row} from "../types";
import {CartOverview} from "./CartOverview";
import bundles from '../__MOCKDATA__/bundles';
import products from '../__MOCKDATA__/products';

const genericHandler = () => {};
const bundleOrder = [
	'isFree',
	20520, //Individual
	20518, //Advanced
	48255, //Agency
];

const ordered = orderProducts(bundles,products,bundleOrder);
describe( 'Main component', () => {

	it.skip( 'Passes snapshot tests', () => {
		const component = renderer.create(<CalderaPay
			settings={{
				apiRoot: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
				cartRoute: 'https://calderaformscom.lndo.site/wp-json/calderapay/v1/cart',
				checkoutLink: 'https://calderaformscom.lndo.site/checkout',
				bundleOrder: bundleOrder
			}}

		/>);
		expect( component.toJSON() ).toMatchSnapshot();
	});


});

const cartItems = [
	{
		id: 20520,
	}
];

describe( 'Individual components', () => {
	it( 'BeforeCart snapshot empty cart', () => {
		const component = renderer.create(
			<BeforeCart
				productsInCart={[]}
				checkoutLink={'https://calderaformscom.lndo.site/checkout'}
				onClose={genericHandler}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});


	it( 'BeforeCart snapshot empty cart', () => {

		const component = renderer.create(
			<BeforeCart
				productsInCart={cartItems}
				checkoutLink={'https://calderaformscom.lndo.site/checkout'}
				onClose={genericHandler}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});

});

describe( 'CalderaPay components', () => {
	it( 'BeforeCart snapshot empty cart', () => {
		const component = renderer.create(
			<BeforeCart
				productsInCart={[]}
				checkoutLink={'https://calderaformscom.lndo.site/checkout'}
				onClose={genericHandler}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});


	it( 'BeforeCart snapshot empty cart', () => {
		const cartItems = [
			{
				id:
					20520,
				options:
					{},
			}
		];
		const component = renderer.create(
			<BeforeCart
				productsInCart={cartItems}
				checkoutLink={'https://calderaformscom.lndo.site/checkout'}
				onClose={genericHandler}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});


	it( 'ProductGrid matches snapshot', () => {
		const headers = [
			{
				label: 'Add-On Name',
				className: 'sr-only',
				key: 'label',
				id: 0
			},
			{
				key: 'isFree',
				label: 'Free',
				className: '',
				id: 0
			},
			{
				label: 'Bundle 1',
				className: '',
				id: 1,
				key: 1,
				addToCart: 'https://cart.com'
			},
			{
				label: 'Bundle 2',
				className: '',
				id: 2,
				key: 2,
				addToCart: 'https://cart.com'
			}

		];

		const rows : Array<Row> = [
			{
				key: 42,
				label: 'Product in bundle 1',
				isFree: 'No',
				addToCart: 'https://cart.com',
				link: 'https://link.com',
				1: true,
				2: false
			},
			{
				key: 43,
				label: 'Product in bundle 1 and 2',
				isFree: 'No',
				addToCart: 'https://cart.com',
				link: 'https://link.com',
				1: true,
				2: true,
			},

		];

			const component = renderer.create(
				<ProductGrid
					headers={headers} rows={rows} onAddToCart={genericHandler} bundles={bundles}/>
			);
			expect(component.toJSON()).toMatchSnapshot();
	});




	it( 'CartOverview matches snapshot with no items in cart', () => {
		const component = renderer.create(
			<CartOverview productsInCart={[]} checkoutLink={'https://link.com'}/>
		);
		expect(component.toJSON()).toMatchSnapshot();


	});

	it( 'CartOverview matches snapshot with  items in cart', () => {
		const component = renderer.create(
			<CartOverview productsInCart={cartItems} checkoutLink={'https://link.com'}/>
		);
		expect(component.toJSON()).toMatchSnapshot();


	});

	it( 'ProductSearch matches snapshot with no search term', () => {
		const component = renderer.create(
			<ProductSearch onProductSearch={genericHandler} searchTerm={''}/>
		);
		expect(component.toJSON()).toMatchSnapshot();

	});


	it( 'ProductSearch matches snapshot with a search term', () => {
		const component = renderer.create(
			<ProductSearch onProductSearch={genericHandler} searchTerm={'MailChimp'}/>
		);
		expect(component.toJSON()).toMatchSnapshot();


	});


});