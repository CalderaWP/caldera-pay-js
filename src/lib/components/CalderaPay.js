// @flow
import React,{Component} from 'react';
import {ProductGrid} from "./ProductGrid";
import type {Product, ColumnHeader, CalderaPaySettings,
	//ProductCollection,
	Row} from "../types";
import {ProductSearch} from "./ProductSearch";
import Fuse from 'fuse.js';
import {pickArray,intersect,inBundle} from "../util";
import {Spinner} from '@wordpress/components';

/**
 * Props type for CalderaPay Component
 */
type Props = {
	settings: CalderaPaySettings,
	fuseOptions: ?Fuse.FuseOptions
};

/**
 * State type for CalderaPay Component
 */
type State = {
	products: Array<Product>,
	bundles:Array<Product>,
	ordered: Array<number>,
	searchTerm: string,
	hasLoaded: boolean
};



/**
 * The outermost container for CalderaPay UI
 */
export class CalderaPay extends Component<Props,State> {

	/** @inheritDoc **/
	static defaultProps = {
		fuseOptions: {
			shouldSort: false,
			threshold: 0.6,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 3,
			keys: [
				'title.rendered',
				'content.rendered',
				'excerpt.rendered'
			]
		},
	};

	loaded: boolean;

	/**
	 * @type State
	 */
	state = {
		products: [],
		bundles: [],
		ordered: [],
		searchTerm: '',
		hasLoaded: false
	};

	/** @inheritDoc **/
	constructor(props: Props){
		super(props);
		(this: any).setSearchTerm = this.setSearchTerm.bind(this);


	}

	/** @inheritDoc **/
	componentDidMount() {
		const {apiRoot,bundleOrder} = this.props.settings;

		/**
		 * Get the products
		 * @type {Promise<Response | never>}
		 */
		const productsRequest = fetch(`${apiRoot}?category=caldera-forms-add-ons&per_page=50&calderaPay=1`, {
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
			fetch(`${apiRoot}?cf-pro=1&calderaPay=1`, {
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

			let bundleMap = {};
			const {products,bundles} = this.state;
			bundles.forEach((bundle) => {
				bundleMap[bundle.id] = products.filter( product => inBundle(product.id, bundle.calderaPay));
			});
			bundleMap['isFree'] = products.filter( (product: Product ) => product.calderaPay.prices.free );
			let ordered : Array<number> = [];

			/**
			 * Concact two arrays of numbers, adding ONLY unique values
			 * @param {(number)[]} currentValues Array to add to. All values of this array will remain.
			 * @param {(number)[]} newValues Values to add to current values. Only values NOT present in currentValues will be added.
			 * @return {(number)[]}
			 */
			const addToArrayUniqueNewOnly = (currentValues: Array<number>, newValues: Array<number> ) : Array<number> =>{
				return Array.from(new Set( currentValues.concat(newValues)));
			};

			bundleOrder.forEach( (key:number|string) => {
				ordered = addToArrayUniqueNewOnly( ordered, pickArray(bundleMap[key], 'id'));
			});
			this.setState({
				ordered,
				isLoaded: true
			});
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
			const product : Product = products.find(
				product => productId === parseInt( product.id,10)
			);
			const {calderaPay} = product;
			const row : Row = {
				key: product.id,
				label: product.title.rendered,
				isFree: calderaPay.prices.free ? 'Yes' : 'No',
				addToCart: calderaPay.prices.addToCart,
				link: product.link
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
		const {bundles} = this.state;
		//Bundles not set yet? Bail early
		if( ! bundles.length ){
			return columns;
		}

		const {bundleOrder} = this.props.settings;
		const bundleIds = bundleOrder.filter( x => ! isNaN(x));
		bundleOrder
			.filter( x => ! isNaN(x))
			.forEach((bundleId:number) => {
				function findBundle(bundleId:number) : Product {
					return bundles.find( (bundle:Product) => bundle.id === bundleId );
				}

			const bundle = findBundle(bundleId);
			const {calderaPay} = bundle;
			columns.push({
				label: bundle.title.rendered,
				className: '',
				id: bundle.id,
				key: bundle.id,
				addToCart: calderaPay.prices.addToCart
			});
		});
		return columns;

	}

	/**
	 * Mutate search term in state
	 *
	 * @param {string} searchTerm
	 */
	setSearchTerm(searchTerm:string) {
		const {ordered} = this.state;
		this.setState({searchTerm});
		//This should be its own method
		const {products} = this.state;
		//No way newing Fuse everytime will be performant.
		//Would need to new it every time this.state.products mutates though
		const result = new Fuse(products,this.props.fuseOptions).search(searchTerm);
		this.setState({ordered:pickArray(intersect(ordered,result),'id')});

	}

	/** @inheritDoc **/
	render() {
		const {state} = this;
		const {searchTerm, isLoaded } = state;
		if( ! isLoaded ){
			return <div><div className={'sr-only'}>Loading</div><Spinner/></div>
		}
		return (
			<div>
				<ProductSearch
					searchTerm={searchTerm}
					onProductSearch={this.setSearchTerm}
				/>
				<ProductGrid
					products={state.products}
					rows={this.getRows()}
					headers={this.getHeaders()}
				/>
			</div>
		);


	}
}


