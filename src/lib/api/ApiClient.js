// @flow
import type {CalderaPaySettings, CalderaPayUserSettings, Product} from "../types";
import {requestHeaders} from "./requestHeaders";
import {orderProducts} from "../util/orderProducts";
export type ProductsData = {
	ordered: Array<number>,
	bundles: Array<Product>,
	products: Array<Product>
}

export type TransientKeyData = {
	transientKey:string
};
export class ApiClient  {

	settings: CalderaPaySettings;
	userSettings: CalderaPayUserSettings;
	jwtToken: string;
	constructor( settings:CalderaPaySettings,userSettings:CalderaPayUserSettings){
		this.settings = settings;
		this.userSettings = userSettings;
	}

	setJwt(jwtToken:string){
		this.jwtToken = jwtToken;
	}


	getCheckoutKey() :
		Promise<TransientKeyData>
	{
		const {settings} = this;
		const request = fetch(`${settings.embeddedApi.keyRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers: requestHeaders(this.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
			});

		let responseData  = {};
		return Promise.all([request]).then((values: Array<any>) => {
			responseData= values[0];
		}).then(() : TransientKeyData => {
			return {
				transientKey: responseData.transientKey
			}

		});

	}
	getProducts(bundleOrder:Array<string|number>)
		: Promise<ProductsData> {
		const {productsRoute} = this.settings;

		let products = [];
		let bundles = [];

		/**
		 * Get the products
		 * @type {Promise<Response | never>}
		 */
		const productsRequest = fetch(`${productsRoute}?category=caldera-forms-add-ons&per_page=50&calderaPay=1`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers: requestHeaders(this.jwtToken),

		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
			});

		/**
		 * Get the bundled products
		 * @type {Promise<Response | never>}
		 */
		const bundlesRequest = fetch(`${productsRoute}?cf-pro=1&calderaPay=1`, {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers: requestHeaders(this.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				return response;
		});

		//Dispatch both requests at once, then order results and stuff
		return Promise.all([productsRequest, bundlesRequest]).then((values: Array<any>) => {

				products = undefined !== typeof values[0] ? values[0] : [];
				bundles = undefined !== typeof values[1] ? values[1] : [];

		}).then(() : ProductsData => {

			const ordered = orderProducts(bundles, products, bundleOrder);
			return({
				ordered,
				bundles,
				products
			})
		});
	}
}