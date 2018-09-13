// @flow
import React,{Component} from 'react';
import {ProductGrid} from "./ProductGrid";
import type {
	Product, ColumnHeader, CalderaPaySettings,
	//ProductCollection,
	Row, CalderaPayUserSettings
} from "../types";
import type {WordPressUser} from "../types/WordPress";
import {ProductSearch} from "./ProductSearch";
import Fuse from 'fuse.js';
import {pickArray,intersect,inBundle} from "../util";
import {Spinner} from '@wordpress/components';
import {CartOverview} from "./CartOverview";
import {BeforeCart} from './BeforeCart';
import {orderProducts} from "../util/orderProducts";
import bundles from "../__MOCKDATA__/bundles";
import {CartContentsTable} from "./CartContentsTable";
import {User} from "../containers/User";
import {requestHeaders} from "../api/requestHeaders";

/**
 * Props type for CalderaPay Component
 */
type Props = {
	settings: CalderaPaySettings,
	userSettings: CalderaPayUserSettings,
	fuseOptions: ?Fuse.FuseOptions,
};
type CartItem = {
	id: number,
	quantity: number
};
type CartContents = Array<CartItem>;
/**
 * State type for CalderaPay Component
 */
type State = {
	products: Array<Product>,
	bundles:Array<Product>,
	ordered: Array<number>,
	searchTerm: string,
	hasLoaded: boolean,
	cartContents: CartContents,
	showBeforeCart: boolean,
	user: WordPressUser,
	jwtToken: string
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
		hasLoaded: false,
		cartContents: [],
		jwtToken: '',
		showBeforeCart: false,
		user: {
			id:0,
			username:'',
			name: '',
			first_name: '',
			last_name: '',
			email: ''
		},
	};

	/** @inheritDoc **/
	constructor(props: Props){
		super(props);
		(this: any).setSearchTerm = this.setSearchTerm.bind(this);
		(this: any).addToCart = this.addToCart.bind(this);
		(this: any).closeBeforeCart = this.closeBeforeCart.bind(this);
		(this: any).requestCartContents = this.requestCartContents.bind(this);
		(this: any).onValidateToken = this.onValidateToken.bind(this);

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
			headers:requestHeaders(this.state.jwtToken),

		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
		});

		/**
		 * Get the bundled products
		 * @type {Promise<Response | never>}
		 */
		const bundlesRequest = fetch(`${apiRoot}?cf-pro=1&calderaPay=1`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers:requestHeaders(this.state.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
		});

		//Dispatch both requests at once, then order results and stuff
		Promise.all([productsRequest,bundlesRequest]).then((values) =>{
			this.setState({
				products: undefined !== typeof values[0] ? values[0] : [],
				bundles: undefined !== typeof values[1] ? values[1] : []
			});
		}).then(() => {
			const {products,bundles} = this.state;
			let ordered = orderProducts(bundles, products, bundleOrder);
			this.setState({
				ordered,
				hasLoaded: true
			});
			this.requestCartContents();
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
				isFree: calderaPay.prices.free,
				addToCart: calderaPay.prices.addToCart,
				link: product.link,
				product: product
			};

			bundles.forEach( (bundle) : Product => {
				row[bundle.id] = inBundle(product.id, bundle.calderaPay);
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
				id: 0,
				showLabel: true,
			},
			{
				key: 'isFree',
				label: 'Free',
				className: '',
				id: 0,
				showLabel: false,
			},

		];
		const {bundles} = this.state;
		//Bundles not set yet? Bail early
		if( ! bundles.length ){
			return columns;
		}

		this.props.settings.bundleOrder
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
				addToCart: calderaPay.prices.addToCart,
				bundle: bundle,
				showLabel: false,

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

	/**
	 * Handle Add To CartOverview
	 *
	 * @param addProduct
	 */
	addToCart(addProduct:number){
		const settings = this.props.settings;
		const {cartRoute} = settings;
		this.setState({hasLoaded:false});
		fetch(`${cartRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'POST',
			headers:requestHeaders(this.state.jwtToken),

			body: JSON.stringify({addProduct,calderaPay:true})


		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(cartContents => {
				this.requestCartContents().then(() => {
					this.setState({
						hasLoaded: true
					});
				})
			});
	}

	/**
	 * Request cart contents via API
	 */
	requestCartContents() : Promise<any>{
		const settings = this.props.settings;
		const {cartRoute} = settings;
		return fetch(`${cartRoute}?calderaPay=1`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers:requestHeaders(this.state.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(cartContents => {
				this.setState({
					cartContents,
					showBeforeCart: true,
					hasLoaded: true
				});
			});
	}

	/**
	 * Get products in cart
	 *
	 * @return {Array}
	 */
	getProductsInCart() : Array<Product>
	{
		const {products,cartContents} = this.state;
		const productsInCart = [];
		if( cartContents.length ){
			cartContents.forEach((item:CartItem) => {
				productsInCart.push(products.find(
					(product : Product) => product.id === item.id )
				);
			});
		}

		return productsInCart;
	}


	/**
	 * Close before cart info/modal
	 */
	closeBeforeCart(){
		this.setState({showBeforeCart:false})
	}


	onValidateToken(jwtToken:string){
		this.setState({jwtToken});
	}
	/** @inheritDoc **/
	render() {
		const {state,props} = this;
		const {searchTerm, hasLoaded,showBeforeCart,jwtToken } = state;
		if( ! hasLoaded ){
			return <div><div className={'sr-only'}>Loading</div><Spinner/></div>
		}
		const productsInCart = this.getProductsInCart();
		return (
			<div className={'container'}>
				{showBeforeCart &&
					<React.Fragment>
						<BeforeCart
							productsInCart={productsInCart}
							checkoutLink={props.settings.checkoutLink}
							onClose={this.closeBeforeCart}
						/>
						<CartContentsTable
							productsInCart={productsInCart}
						/>
						<User
							settings={this.props.userSettings}
							jwtToken={jwtToken}
							onValidateToken={this.onValidateToken}
						/>

					</React.Fragment>

				}

				{!showBeforeCart &&

					<React.Fragment>
						<div className={'row'}>
							<div className={'col-md-9'}>
								<ProductSearch
									searchTerm={searchTerm}
									onProductSearch={this.setSearchTerm}
								/>
							</div>
							<div className={'col-md-3'}>
								<CartOverview
									productsInCart={productsInCart}
									checkoutLink={props.settings.checkoutLink}
								/>
							</div>
						</div>

						<div>
							<ProductGrid
								products={state.products}
								rows={this.getRows()}
								headers={this.getHeaders()}
								onAddToCart={this.addToCart}
								bundles={bundles}
							/>
						</div>

					</React.Fragment>

				}


			</div>

		);


	}
}


