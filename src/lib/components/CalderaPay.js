// @flow
import React, {Component} from 'react';
import {ProductGrid} from "./ProductGrid";
import type {
	Product, ColumnHeader, CalderaPaySettings,
	//ProductCollection,
	Row, CalderaPayUserSettings
} from "../types";
import type {WordPressUser} from "../types/WordPress";
import {ProductSearch} from "./ProductSearch";
import Fuse from 'fuse.js';
import {pickArray, intersect, inBundle} from "../util";
import {Spinner} from '@wordpress/components';
import bundles from "../__MOCKDATA__/bundles";
import {User} from "../containers/User";
import {SelectBundle} from "../containers/SelectBundle";
import {ApiClient} from "../api/ApiClient";
import type {ProductsData, TransientKeyData} from "../api/ApiClient";

/**
 * Props type for CalderaPay Component
 */
type Props = {
	settings: CalderaPaySettings,
	userSettings: CalderaPayUserSettings,
	fuseOptions: ?Fuse.FuseOptions,
	apiClient: ApiClient
};

/**
 * State type for CalderaPay Component
 */
type State = {
	products: Array<Product>,
	bundles: Array<Product>,
	ordered: Array<number>,
	searchTerm: string,
	hasLoaded: boolean,
	user: WordPressUser,
	jwtToken: string,
	productSelectedId: ?number,
	productIdToPurchase: ?number,
	transientKey: string
};


/**
 * The outermost container for CalderaPay UI
 */
export class CalderaPay extends Component<Props, State> {

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
		jwtToken: '',
		user: {
			id: 0,
			username: '',
			name: '',
			first_name: '',
			last_name: '',
			email: ''
		},
		productSelectedId: 0,
		productIdToPurchase: 0,
		transientKey: ''
	};

	/** @inheritDoc **/
	constructor(props: Props) {
		super(props);
		(this: any).setSearchTerm = this.setSearchTerm.bind(this);
		(this: any).onValidateToken = this.onValidateToken.bind(this);
		(this: any).setProductSelected = this.setProductSelected.bind(this);
		(this: any).productIdToPurchase = this.productIdToPurchase.bind(this);

		const {settings,userSettings} = this.props;
	}

	/** @inheritDoc **/
	componentDidMount() {
		const {settings,apiClient} = this.props;
		const {bundleOrder} = settings;
		apiClient.getProducts(bundleOrder).then((data:ProductsData)=> {
			this.setState({
				products:data.products,
				bundles:data.bundles,
				ordered:data.ordered,
				hasLoaded: true
			});
		});


	}


	/**
	 * Get the product table rows of products, in order
	 * @return {Array}
	 */
	getRows(): Array<Row> {
		const rows = [];
		const {products, bundles, ordered} = this.state;
		ordered.forEach((productId: number) => {
			const product: Product = products.find(
				product => productId === parseInt(product.id, 10)
			);
			const {calderaPay} = product;
			const row: Row = {
				key: product.id,
				label: product.title.rendered,
				isFree: calderaPay.prices.free,
				addToCart: calderaPay.prices.addToCart,
				link: product.link,
				product: product
			};

			bundles.forEach((bundle): Product => {
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
	getHeaders(): Array<ColumnHeader> {
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
		if (!bundles.length) {
			return columns;
		}

		this.props.settings.bundleOrder
			.filter(x => !isNaN(x))
			.forEach((bundleId: number) => {
				function findBundle(bundleId: number): Product {
					return bundles.find((bundle: Product) => bundle.id === bundleId);
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
	setSearchTerm(searchTerm: string) {
		const {ordered} = this.state;
		this.setState({searchTerm});
		//This should be its own method
		const {products} = this.state;
		//No way newing Fuse everytime will be performant.
		//Would need to new it every time this.state.products mutates though
		const result = new Fuse(products, this.props.fuseOptions).search(searchTerm);
		this.setState({ordered: pickArray(intersect(ordered, result), 'id')});

	}

	/**
	 * Set the product that is currently selected
	 *
	 * @param productSelectedId
	 */
	setProductSelected(productSelectedId: number) {
		this.setState({productSelectedId});
	}


	getSelectedProduct(): {
		product: Product,
		bundlesIncludedIn: ?Array<Product>
	} {

		const {products, bundles, productSelectedId} = this.state;
		const product: Product = products.find(
			product => productSelectedId === parseInt(product.id, 10)
		);

		const bundlesIncludedIn: Array<Product> = [];

		this.props.settings.bundleOrder
			.filter(x => !isNaN(x))
			.forEach((bundleId: number) => {
				function findBundle(bundleId: number): Product {
					return bundles.find((bundle: Product) => bundle.id === bundleId);
				}

				const bundle = findBundle(bundleId);
				bundlesIncludedIn.push(bundle);
			});

		return {
			product,
			bundlesIncludedIn,
		}
	}


	onValidateToken(jwtToken: string) {
		this.setState({jwtToken});
	}

	productIdToPurchase(productIdToPurchase: number) {
		this.setState({productIdToPurchase});
	}

	/** @inheritDoc **/
	render() {
		const {state, props} = this;
		const {searchTerm, hasLoaded, productSelectedId, jwtToken, productIdToPurchase} = state;
		const {userSettings} = props;
		if (!hasLoaded) {
			return <div>
				<div className={'sr-only'}>Loading</div>
				<Spinner/></div>
		}
		return (
			<div className={'container'}>
				{productSelectedId &&
				<React.Fragment>
					<div>
						{!productIdToPurchase &&
						<SelectBundle
							product={this.getSelectedProduct().product}
							bundlesIncludedIn={this.getSelectedProduct().bundlesIncludedIn}
							onSelectForPurchase={this.productIdToPurchase}
						/>
						}

					</div>

					{productIdToPurchase &&
					<div className={'row'}>
						<div className={'col-sm-12 col-md-6'}>
							<User
								settings={userSettings}
								jwtToken={jwtToken}
								onValidateToken={this.onValidateToken}
							/>
						</div>
						<div className={'col-sm-12 col-md-6'}>

							<div>Payment Form</div>
						</div>


					</div>

					}
				</React.Fragment>

				}

				{!productSelectedId &&
				<React.Fragment>
					<div className={'row'}>
						<div className={'col-md-9'}>
							<ProductSearch
								searchTerm={searchTerm}
								onProductSearch={this.setSearchTerm}
							/>
						</div>
						<div className={'col-md-3'}>
							<User
								settings={userSettings}
								jwtToken={jwtToken}
								onValidateToken={this.onValidateToken}
							/>
						</div>
					</div>

					<div>
						<ProductGrid
							products={state.products}
							rows={this.getRows()}
							headers={this.getHeaders()}
							onAddToCart={this.setProductSelected}
							bundles={bundles}
						/>
					</div>
				</React.Fragment>
				}


			</div>

		);


	}
}


