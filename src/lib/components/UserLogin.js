// @flow
import React from 'react';
import {RenderGroup} from '@caldera-labs/components';
import type {WordPressUser} from "../types/WordPress";

type Props = {
	email: 	string,
	onSubmit: Function,
	onPasswordChange: Function,
	password: ?string
};

/**
 * Displays product cart
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const UserLogin = (props: Props) => {


	/**
	const emailField = {
		id: 'caldera-pay-customer-email',
		label: 'Email Address',
		desc: '',
		type: 'input',
		required: true,
		innerType: 'email',
		inputClass: 'form-control',
		value: props.email,
		onValueChange: (newValue) => {

		}
	};
	 **/


	const passwordField = {
		id: 'caldera-pay-customer-password',
		label: 'Password',
		desc: '',
		type: 'input',
		required: true,
		innerType: 'password',
		inputClass: 'form-control',
		value: props.password,
		onValueChange: (newValue) => {
			props.onPasswordChange(newValue);
		}
	};
	const configFields = [
		passwordField
	];



	return (
		<div>
			<RenderGroup
				configFields={configFields}
				className={'caldera-pay-customer-login'}
			/>
		</div>
	);
};
