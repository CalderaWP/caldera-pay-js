/**
 *
 * paymentRequestConfig.paymentDetails.total or
 * paymentRequestConfig.paymentDetails.displayItems
 */
export type PaymentItem = {
	label: string,
	amount: {
		currency: string,
		value: number
	}
};


/**
 * Price details for a Qualpay payment
 */
export type QualpayPaymentDetails = {
	total: PaymentItem,
	displayItems: Array<PaymentItem>
}