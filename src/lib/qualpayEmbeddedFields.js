// @flow
import {getElement} from "./util/getElement";
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


	/**
	 * Create Qualpay emebed fields
	 * @param {string} formId ID of form element to use
	 * @param {QualpaySettings} settings
	 * @param {ApiClient} apiClient
	 */
	constructor (formId: string, settings: QualpaySettings, apiClient: ApiClient){
		const{domNodeId} = settings;
		this.formId = formId;
		this.cardNumberId = settings.cardNumberId ? settings.cardNumberId : 'caldera-pay-card-number';
		this.cardExpId = settings.cardExpId ? settings.cardExpId : 'caldera-pay-card-exp';
		this.cardCvvId = settings.cvvId ? settings.cvvId : 'caldera-pay-card-cvv';

		this.domNodeId = domNodeId;

		this.settings = settings;
		this.apiClient = apiClient;
	}

	/**
	 * Create element ID for label
	 *
	 * @param {string} mainId ID of element being labeled
	 * @return {string}
	 */
	createLabelId(mainId : string ) : string {
		return `${mainId}-label`;
	}

	/**
	 * Create element ID for aria description
	 *
	 * @param {string} mainId ID of element being described
	 * @return {string}
	 */
	createDescribedId(mainId: string ) : string{
		return `${mainId}-description`;

	}

	/**
	 * Create payment fields
	 * @return {{card_number: {id: string, attributes: {id: string, required: boolean, placeholder: string, arialabelledby: string, ariadescribedby: string}, onblur(BlurEvent): void}, exp_date: {id: string, attributes: {id: string, placeholder: string, arialabelledby: string, ariadescribedby: string}, onblur(BlurEvent): void}, cvv2: {id: string, attributes: {id: string, placeholder: string, required: boolean, arialabelledby: string, ariadescribedby: string}, onblur(BlurEvent): void}}}
	 */
	getPaymentFields(){

		const cardNumberMessagesElement = getElement(this.createDescribedId(this.cardNumberId));
		const cardExpMessagesElement = getElement(this.createDescribedId(this.cardExpId));
		const cardCvvMessagesElement = getElement(this.createDescribedId(this.cardCvvId));
		type BlurEvent = {errors: Array<string>};
		const handleErrorsOnBlur = (event: BlurEvent,element : Element) => {
			if( undefined === typeof  event.errors || null === cardNumberMessagesElement ){
				return;
			}
			const {errors} = event;
			const message =  Array.isArray(errors) && errors.length ? errors[0] : '';
			element.innerHTML = message;
		}
		return {
			"card_number": {
				id: this.cardNumberId,
				attributes: {
					id: this.cardNumberId,
					required: true,
					placeholder: "4111111111111111",
					arialabelledby: this.createLabelId(this.cardNumberId),
					ariadescribedby: this.createDescribedId(this.cardNumberId)
				},
				onblur(event: BlurEvent)  {
					handleErrorsOnBlur(event,cardNumberMessagesElement);
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
				onblur(event: BlurEvent)  {
					handleErrorsOnBlur(event,cardExpMessagesElement);
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
				onblur(event: BlurEvent)  {
					handleErrorsOnBlur(event,cardCvvMessagesElement);
				}
			}
		};
	}

	putFormOnDom(parentNode: Node){
		const {formId,cardExpId,cardNumberId,cardCvvId} = this;
			/** Put the form in the DOM **/
			const form = `
				<form id="${formId}" method="post" action="/">
				  <div id="qp-embedded-container" align="center">
					  	<div class="row">
							<div class="form-group">
								<label
									id="${this.createLabelId(cardNumberId)}"
									for="${cardNumberId}"
								>
									Card Number
								</label>
								<div id="${cardNumberId}"></div>
								<div class="description" id="${this.createDescribedId(cardNumberId)}"></div>								
							</div>
						</div>
						<div class="row">
							<div class="form-group col-sm-12 col-md-6">
								<label
									id="${this.createLabelId(cardExpId)}"
									for="${cardExpId}"
								>
									Expiration Date
								</label>
								<div id="${cardExpId}"></div>
								<div class="description" id="${this.createDescribedId(cardExpId)}"></div>
							</div>
							<div class="form-group col-sm-12 col-md-6">
								<label
									id="${this.createLabelId(cardCvvId)}"								
									for="${cardCvvId}"
								>
									CVV
								</label>
								<div id="${cardCvvId}"></div>
								<div class="description" id="${this.createDescribedId(cardCvvId)}"></div>
							</div>
						</div>
						<div class="row">
							<input type="submit" name="submit" value="Pay Now" class="btn-primary btn-orange" />
						</div>
											
				</form>`;
		const el = document.createElement('div');
		el.innerHTML = form;
		parentNode.appendChild(el);
		return this;
	}

	/**
	 * Load Qualpay hosted check out
	 *
	 *
	 * @param {QualpayPaymentDetails} paymentDetails Details for payment
	 * @param {Function} onSuccess Callback function when payment is successful. Passed tokenized card ID.
	 * @param {Function} onError Callback when payment errors
	 * @return {qualpayEmbeddedFields}
	 */
	loadCheckout(
		paymentDetails: QualpayPaymentDetails,
		onSuccess:(cardId: string) => void,
		onError: (errors:Array<string>) => void
	){
		const clientSource = 'https://app-dev.qualpay.com/hosted/embedded/js/qp-embedded-sdk.min.js';
		const {apiClient,settings,formId} = this;
		const {merchantId} = settings;
		loadScript(clientSource)
			.then(async (scriptRef) => {
				const response = await apiClient.getCheckoutKey();
				const {transientKey} = response;
				const qualPayArgs = {
					fields: this.getPaymentFields(),
					formId,
					mode: settings.mode,
					transientKey: transientKey,
					tokenize: true,
					onSuccess: (data: {card_id:string,card_number:string}) => {
						return onSuccess(data.card_id);
					},
					onError: (error) => {
						return onError(error);

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
				window.qpEmbeddedForm.loadFrame(merchantId,qualPayArgs);
			});
		return this;

	}

	hideCheckout(){
		const element = getElement(this.formId);
		element.style.display = 'none';
		element.visibility = 'hidden';
	}


};