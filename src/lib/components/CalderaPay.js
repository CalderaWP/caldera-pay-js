// @flow
import React,{Component} from 'react';
import {ProductGrid} from "./ProductGrid";
import type {Product, ColumnHeader, CalderaPaySettings, ProductCollection, CalderaPayProductInfo, Row} from "../types";

/**
 * Props type for CalderaPay Component
 */
type Props = {
	settings: CalderaPaySettings,

};

/**
 * State type for CalderaPay Component
 */
type State = {...ProductCollection, ordered: Array<number> };

/**
 * Check if a product is in a bundle
 * @param {Number}productId
 * @param {CalderaPayProductInfo}bundleProductInfo
 * @return {Boolean}
 */
const inBundle = (productId: number, bundleProductInfo: CalderaPayProductInfo) : boolean => {
	const bundledDownloads = bundleProductInfo.bundle.includes.map((value: string): number => { return parseInt(value,10)});
	return bundledDownloads.includes(parseInt(productId,10));
};


/**
 * The outermost container for CalderaPay UI
 */
export class CalderaPay extends Component<Props,State> {


	/**
	 * @type State
	 */
	state = {
		products: [],
		bundles: [],
		ordered: []
	};

	/** @inheritDoc **/
	componentDidMount() {
		const {apiRoot,bundleOrder} = this.props.settings;

		/**
		 * Get the products
		 * @type {Promise<Response | never>}
		 */
		const productsRequest = fetch(`${apiRoot}?category=caldera-forms-add-ons&per_page=50`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",

		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
		});

		/**
		 * Get the bundled products
		 * @type {Promise<Response | never>}
		 */
		const bundlesRequest =
			fetch(`${apiRoot}?cf-pro=1`, {
				mode: 'cors',
				redirect: 'follow',
				cache: "default",

			}).then(response => response.json())
				.catch(error => console.error('Error:', error))
				.then(response => {
					return response;
		});

		//Dispatch both requests at once, then order results and stuff
		Promise.all([productsRequest,bundlesRequest]).then((values) =>{
			this.setState({
				products: values[0],
				bundles: values[1]
			});

		}).then(() => {
			type bundleMapType = bundleOrder;
			let bundleMap : bundleMapType = {};
			const {products,bundles} = this.state;
			bundles.forEach((bundle) => {
				bundleMap[bundle.id] = products.filter( product => inBundle(product.id, bundle.calderaPay));
			});
			bundleMap['isFree'] = products.filter( (product: Product ) => product.calderaPay.prices.free );
			let ordered = [];
			//This is copied from caldera-admin. Choose one location.
			const pickArray = (array, key) => {
				return array.reduce(
					(accumualtor, item) =>
						accumualtor.concat([item[key]]), []
				);
			};
			bundleOrder.forEach( (key:number|string) => {

				ordered = Array.from(new Set( ordered.concat(pickArray(bundleMap[key], 'id'))));

			});
			this.setState({ordered});
		});

	}

	/**
	 * Get the product table rows of products, in order
	 * @return {Array}
	 */
	getRows() : Array<Row> {
		const rows = [];
		const {products,bundles,ordered} = this.state;
		ordered.forEach((productId: number) => {
			const product : Product = products.find( product => productId === parseInt( product.id,10) );
			const {calderaPay} = product;
			const row : Row = {
				key: product.id,
				label: product.title.rendered,
				isFree: calderaPay.prices.free ? 'Yes' : 'No'
			};

			bundles.forEach( (bundle) : Product => {
				row[bundle.id] = inBundle(product.id, bundle.calderaPay) ? 'Yes' : 'no';
			});
			rows.push(row);
		});


		return rows;


	}

	/**
	 * Get the product table headers, in order.
	 * @return {*[]}
	 */
	getHeaders() : Array<ColumnHeader>{
		const columns = [
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

		];
		this.state.bundles.forEach((bundle): Product => {
			columns.push({
				label: bundle.title.rendered,
				className: '',
				id: bundle.id,
				key: bundle.id
			});
		});
		return columns;

	}

	/** @inheritDoc **/
	render() {
		const {state} = this;

		return (
			<ProductGrid
				products={state.products}
				rows={this.getRows()}
				headers={this.getHeaders()}
			/>
		);

	}
}


