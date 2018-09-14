// @flow
/* global qpEmbeddedForm */

import React, {Component} from 'react';

export type PaymentItem = {
	label: string,
	amount: {
		currency: string,
		value: number
	}
};
type Props = {
	formId: string,
	mode?: string,
	transientKey: string,
	merchantId: string,
	onSuccess: Function,
	onError: Function,
	total: PaymentItem,
	displayItems ?:  Array<PaymentItem>,
	checkoutOptions ?: {
		requestPayerName: boolean,
		requestPayerPhone: boolean,
		requestPayerEmail: boolean,
		requestShipping: boolean,
	},
}

type State = {

}
export class CreatePayment extends Component<Props,State> {

	static defaultProps = {
		mode:'test',
		checkoutOptions: {
			requestPayerName: false,
			requestPayerPhone: false,
			requestPayerEmail: false,
			requestShipping: false,
		}
	};



	componentDidMount(){
		const {merchantId,formId,checkoutOptions,onSuccess,onError,mode,total,displayItems} = this.props;

		qpEmbeddedForm.loadFrame(merchantId, {
			formId,
			onSuccess,
			onError,
			mode,
			tokenize: true,
			paymentRequestConfig: {
				paymentDetails: {
					total,
					displayItems
				},
				options: checkoutOptions
			}
		});

	}


	/**
	 * Prevent rerenders
	 *
	 * @inheritDoc
	 */
	shouldComponentUpdate() {
		return false;
	}

	render()
	{
		const {formId} = this.props;
		return(
			<React.Fragment>
				<div id={formId} />
				<button type={'submit'} value={'Purchase' } />
			</React.Fragment>
		)

	}
}
