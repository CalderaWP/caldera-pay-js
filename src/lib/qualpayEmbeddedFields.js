// @flow

import {ApiClient} from "./api/ApiClient";
import type {QualpayPaymentDetails} from "./types/qualpay";
export type QualpaySettings = {
	merchantId: number,
	mode: string,
	domNodeId: string,
	cardNumberId ?: string;
	cardExpId ?: string;
	cvvId ?: string
};

const loadScript = require('simple-load-script');
export class qualpayEmbeddedFields {

	formId: string;
	settings: QualpaySettings;
	apiClient: ApiClient;
	domNodeId: string;

	cardNumberId: string;
	cardExpId: string;
	cardCvvId: string;
	paymentFields: {};


	createLabelId(mainId : string ) : string {
		return `${mainId}-label`;
	}

	createDescribedId(mainId: string ) : string{
		return `${mainId}-description`;

	}
	constructor (formId: string, settings: QualpaySettings, apiClient: ApiClient){
		const{domNodeId} = settings;
		this.formId = formId;
		this.cardNumberId = settings.cardNumberId ? settings.cardNumberId : 'caldera-pay-card-number';
		this.cardExpId = settings.cardExpId ? settings.cardExpId : 'caldera-pay-card-exp';
		this.cardCvvId = settings.cvvId ? settings.cvvId : 'caldera-pay-card-cvv';

		this.domNodeId = domNodeId;
		this.paymentFields = {
			"card_number": {
				id: this.cardNumberId,
				attributes: {
					id: this.cardNumberId,
					required: true,
					placeholder: "4111111111111111",
					arialabelledby: this.createLabelId(this.cardNumberId),
					ariadescribedby: this.createDescribedId(this.cardNumberId)
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
				id: this.cardExpId,
				attributes:{
					id: this.cardExpId,
					placeholder: "11/22",
					arialabelledby: this.createLabelId(this.cardExpId),
					ariadescribedby: this.createDescribedId(this.cardExpId)
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
				id: this.cardCvvId,
				attributes:{
					id: this.cardCvvId,
					placeholder: "CVV",
					required: true,
					arialabelledby: this.createLabelId(this.cardCvvId),
					ariadescribedby: this.createDescribedId(this.cardCvvId)
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
		const {formId,cardExpId,cardNumberId,cardCvvId} = this;
			/** Put the form in the DOM **/
			const form = `
				<form id="${formId}" method="post" action="/">
				  <div id="qp-embedded-container" align="center" style="min-height: 150px;">
				  	<div class="form-group">
						<label 
							for="${cardNumberId}"
						>
							Card Number
						</label>
     					<div id="${cardNumberId}"  class="form-control"></div>
				  	</div>
				  	<div class="form-group">
						<label 
							for="${cardExpId}"
						>
							Expiration Date
						</label>
     					<div id="${cardExpId}" class="form-control"></div>
				  	</div>
				  	<div class="form-group">
						<label 
							for="${cardCvvId}"
						>
							CVV
						</label>
     					<div id="${cardCvvId}" class="form-control"></div>
				  	</div>
				  <input type="submit" name="submit" value="Pay Now" class="btn-primary btn-orange" />
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
				const qualPayArgs = {
					fields: paymentFields,
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
						"#root { min-width: 260px; min-height:500px; }",

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
				};
				console.log(qualPayArgs);
				window.qpEmbeddedForm.loadFrame(merchantId,qualPayArgs);
			});
		return this;

	}




};