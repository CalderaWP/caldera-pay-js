// @flow

import {ApiClient} from "./api/ApiClient";
import type {QualpayPaymentDetails} from "./types/qualpay";
export type QualpaySettings = {
	merchantId: number,
	mode: string,
	domNodeId: string
};

const loadScript = require('simple-load-script');
export class qualpayEmbeddedFields {

	formId: string;
	settings: QualpaySettings;
	apiClient: ApiClient;
	domNodeId: string;
	paymentFields: {};
	constructor (formId: string, settings: QualpaySettings, apiClient: ApiClient){
		const{domNodeId} = settings;
		this.formId = formId;
		this.domNodeId = domNodeId;
		this.paymentFields = {
			"card_number": {
				id: "card-number",
				attributes: {
					id: "123321-card-number",
					required: false,
					placeholder: "4111111111111111",
					arialabelledby: "cardnumber-label",
					ariadescribedby: "cardnumber-descriptor",
				},
				onblur: function (event) {
					let response = "{";
					for (let key in event) {
						response += key + ":" + event[key] + ",";
					}
					response += "}";
					console.log("Card number blur event is " + response);
				}
			},
			"exp_date": {
				id: "exp-date",
				attributes:{
					id: '123321-exp-date',
					placeholder: "Expiration Date",
					arialabelledby:  'exp-date-label',
					ariadescribedby: 'exp-date-descriptor',
				},
				onblur: function (event) {
					let response = "{";
					for (let key in event) {
						response += key + ":" + event[key] + ",";
					}
					response += "}";
					console.log("Exp date blur event is " + response);
				}
			},
			"cvv2": {
				id: "cvv",
				attributes:{
					id: '123321-cvv2',
					placeholder: "CVV",
					required: true,
					arialabelledby:  'cvv-label',
					ariadescribedby: 'cvv-descriptor',
				},
				onblur: function (event) {
					let response = "{";
					for (let key in event) {
						response += key + ":" + event[key] + ",";
					}
					response += "}";
					console.log("cvv blur event is " + response);
				}
			}
		};
		this.settings = settings;
		this.apiClient = apiClient;
	}


	putFormOnDom(parentNode: Node){
		const {formId} = this;
			/** Put the form in the DOM **/
			const form = `
				<form id="${formId}" method="post" action="/">
				  <div id="qp-embedded-container" align="center">
				  </div>
				  <input type="submit" name="submit" value="Pay Now" />
				</form>`;
			const el = document.createElement('div');
			el.innerHTML = form;
			parentNode.appendChild(el);
			return this;
		}

	loadCheckout(
		paymentDetails: QualpayPaymentDetails,
		onSuccess:(cardId: string) => void,
		onError: (errors:Array<string>) => void
	){
		const clientSource = 'https://app-dev.qualpay.com/hosted/embedded/js/qp-embedded-sdk.min.js';
		const {apiClient,settings,formId,paymentFields} = this;
		console.log(formId);
		const {merchantId} = settings;
		loadScript(clientSource)
			.then(async (scriptRef) => {
				const response = await apiClient.getCheckoutKey();
				const {transientKey} = response;
				window.qpEmbeddedForm.loadFrame(merchantId,
					{
						paymentFields,
						formId,
						mode: settings.mode,
						transientKey: transientKey,
						tokenize: true,
						onSuccess: (data: {card_id:string,card_number:string}) => {
							return onSuccess(data.card_id);
						},
						onError: (error) => {
							const errors = [];
							if( error.detail ) {
								for( let key in error.detail ) {
									errors.push(error.detail[key]);
								}
							}
							return onError(errors);
						},
						font: 'Titillium Web',
						style:
							"#root { min-width: 260px; }",

						paymentRequestConfig: {
							paymentDetails,
							options: {
								requestPayerName: false,
								requestPayerPhone: false,
								requestPayerEmail: false,
								requestShipping: false,
								shippingType: 'pickup',
							},
						}
					});
			});
		return this;

	}




};