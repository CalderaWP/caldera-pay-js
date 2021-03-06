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
import type {ProductsData} from "../api/ApiClient";
import {qualpayEmbeddedFields} from "../qualpayEmbeddedFields";
import type {PaymentItem} from "../types/qualpay";
import {LeftTop} from "./portals/LeftTop";
import {TopBar} from "./portals/TopBar";
import {RightTop} from "./portals/RightTop";
import {PurchaseDetails} from "./PurchaseDetails";
import {BreadCrumbs} from "./BreadCrumbs/Breadcrumbs";
import type {BreadCrumbItem} from "./BreadCrumbs/Breadcrumbs";

/**
 * Props type for CalderaPay Component
 */
type Props = {
	settings: CalderaPaySettings,
	userSettings: CalderaPayUserSettings,
	fuseOptions: ?Fuse.FuseOptions,
	apiClient: ApiClient,
	qualpayEmbeddedFields: qualpayEmbeddedFields,
	leftTopDomNode: HTMLElement,
	rightTopDomNode: HTMLElement,
	topBarDomNode: HTMLElement
};

export type CrumbName = 'product'|'bundle'|'info'|'payment'
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
	isPaymentOpen: boolean,
	hasPaymentLoaded: boolean,
	cardToken: string,
	purchaseErrors: Array<string>,
	currentCrumb: CrumbName
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
		isPaymentOpen: false,
		hasPaymentLoaded: false,
		cardToken: '',
		purchaseErrors: [],
		currentCrumb: 'product'
	};

	/** @inheritDoc **/
	constructor(props: Props) {
		super(props);
		(this: any).setSearchTerm = this.setSearchTerm.bind(this);
		(this: any).onValidateToken = this.onValidateToken.bind(this);
		(this: any).setProductSelected = this.setProductSelected.bind(this);
		(this: any).productIdToPurchase = this.productIdToPurchase.bind(this);
		(this: any).onPurchaseError = this.onPurchaseError.bind(this);
		(this: any).onPurchaseSuccess = this.onPurchaseSuccess.bind(this);
		(this: any).getPurchaseTotal = this.getPurchaseTotal.bind(this);
		(this: any).findPurchaseProduct = this.findPurchaseProduct.bind(this);
		(this: any).setCurrentCrumb = this.setCurrentCrumb.bind(this);
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
		this.setState({
			productSelectedId,
			currentCrumb: 'bundle'
		});
	}

	setCurrentCrumb(currentCrumb: CrumbName ){
		this.setState({currentCrumb});
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

	/**
	 * Callback when JWT Token is validated
	 *
	 * @param jwtToken
	 */
	onValidateToken(jwtToken: string) {
		this.setState({jwtToken});
	}

	/**
	 * Callback when payment has succeed
	 * @param cardToken
	 */
	onPurchaseSuccess(cardToken: string){
		this.setState({
			isPaymentOpen: false,
			cardToken,
			purchaseErrors: []
		});
	}

	/**
	 * Set payment errors
	 * @param purchaseErrors
	 */
	onPurchaseError(purchaseErrors: Array<string>){
		this.setState({purchaseErrors});
	}

	/**
	 * When product ID to prucahse is set, load paymen
	 * @param productIdToPurchase
	 */
	productIdToPurchase(productIdToPurchase: number) {
		const{hasPaymentLoaded}= this.state;
		const{qualpayEmbeddedFields,rightTopDomNode}= this.props;
		this.setState({
			productIdToPurchase,
			isPaymentOpen: true,
			currentCrumb: 'info'
		});


		if(! hasPaymentLoaded ){
			const total = this.getPurchaseTotal(productIdToPurchase);
			qualpayEmbeddedFields
				.putFormOnDom(rightTopDomNode)
				.loadCheckout(
					{
						total,
						displayItems:[
							{
								label: 'Tax',
								amount: {
									currency: 'USD',
									value: 1.00,
								},
							},
							{
								label: 'Subtotal',
								amount: {
									currency: 'USD',
									value: 10.00,
								},
							},
						]
					},
					this.onPurchaseSuccess,
					this.onPurchaseError
				);
		}
	}


	/**
	 * Find the product to purchase, based on state.productIdToPurchase
	 * @return {Product}
	 */
	findPurchaseProduct(productIdToPurchase: number): Product {
		const {products,bundles} = this.state;
		return bundles.concat(products).find((product: Product) => {
			return product.id === productIdToPurchase
		});
	}

	/**
	 * Get the total for the purchase
	 *
	 * @param productIdToPurchase
	 * @return {{label: string, amount: {currency: string, value: number}}}
	 */
	getPurchaseTotal(productIdToPurchase: number): PaymentItem
	{
		const product = this.findPurchaseProduct(productIdToPurchase);
		return {
			label: product.title.rendered,
			amount: {
				currency: 'USD',
				value: product.calderaPay.prices.price
			}
		}
	}


	getBreadCrumbs() : Array<BreadCrumbItem> {
		const {currentCrumb,productSelectedId,productIdToPurchase} = this.state;
		function createCrumb(breadCrumb){
			return breadCrumb = {
				...breadCrumb,
				active: currentCrumb === breadCrumb.crumbName
			}
		}


		const breadCrumbs = [
			createCrumb({
				page: 1,
				pageElementId: 'page-1',
				label: 'Choose Product',
				crumbName: 'product',
				disabled: false,
			}),

			createCrumb({
				page: 2,
				pageElementId: 'page-2',
				label: 'Select Price Option',
				crumbName: 'bundle',
				disabled: productSelectedId === 0,
			}),
			createCrumb({
				page: 3,
				pageElementId: 'page-3',
				label: 'Your Information',
				crumbName: 'info',
				disabled: productIdToPurchase === 0,

			}),
			createCrumb({
				page: 4,
				pageElementId: 'page-4',
				label: 'Payment Details',
				crumbName: 'payment',
				disabled: productSelectedId === 0 || productIdToPurchase === 0
			}),
		];

		return breadCrumbs;

	}

	/** @inheritDoc **/
	render() {
		const {state, props} = this;
		const {searchTerm, hasLoaded, jwtToken,isPaymentOpen,productIdToPurchase,currentCrumb} = state;
		const {userSettings,leftTopDomNode,rightTopDomNode,topBarDomNode} = props;
		const BreadCrumbsInTopBar = () => {
			return(
				<TopBar element={topBarDomNode}>
					<BreadCrumbs
						onNavigate={this.setCurrentCrumb}
						items={this.getBreadCrumbs()}
					/>
				</TopBar>
			);
		};



		//Initial Load
		if (!hasLoaded) {
			return (
				<React.Fragment>
					<BreadCrumbsInTopBar/>
					<div>
						<div className={'sr-only'}>Loading</div>
						<Spinner/>
					</div>
				</React.Fragment>

			);
		}

		//Entering Credit Card Details
		//Do NOT use <RightTop> when payment is open
		if( isPaymentOpen){
			return (
				<React.Fragment>
					<BreadCrumbsInTopBar/>
					<LeftTop
						element={leftTopDomNode}

					>
						<User
							settings={userSettings}
							jwtToken={jwtToken}
							onValidateToken={this.onValidateToken}
						/>
					</LeftTop>
					<PurchaseDetails
						product={this.findPurchaseProduct(productIdToPurchase)}
						heading={'Payment Details'}
					/>
				</React.Fragment>

			);
		}

		const Inside = () => {
			switch( currentCrumb ){
				case 'bundle':
					return(
						<SelectBundle
							product={this.getSelectedProduct().product}
							bundlesIncludedIn={this.getSelectedProduct().bundlesIncludedIn}
							onSelectForPurchase={this.productIdToPurchase}
						/>
					);
				case 'info':
					return(
						<User
							settings={userSettings}
							jwtToken={jwtToken}
							onValidateToken={this.onValidateToken}
						/>
					);
				case 'product':
					default :
					return (
						<ProductGrid
							products={state.products}
							rows={this.getRows()}
							headers={this.getHeaders()}
							onAddToCart={this.setProductSelected}
							bundles={bundles}
						/>
					);
			}
		}

		return(
			<React.Fragment>
				<BreadCrumbsInTopBar/>
				<RightTop element={rightTopDomNode}>
					<ProductSearch
						searchTerm={searchTerm}
						onProductSearch={this.setSearchTerm}
					/>
				</RightTop>
				<Inside/>
			</React.Fragment>
		);

	}
}


