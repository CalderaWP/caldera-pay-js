// @flow
import React from 'react';
import {RenderGroup} from '@caldera-labs/components';
import type {WordPressUser} from "../types/WordPress";

type Props = {
	user: 	WordPressUser,
	onChangeEmail: Function,
	onUpdateUserFields: Function
};

/**
 * Displays product cart
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export const UserInfo = (props: Props) => {
	const user = props.user ? props.user : {
		id: 0,
		username:'',
		name: '',
		first_name: '',
		last_name: '',
		email: ''
	};
	const emailField = {
		id: 'caldera-pay-customer-email',
		label: 'Email Address',
		desc: '',
		type: 'input',
		required: true,
		innerType: 'email',
		inputClass: 'form-control',
		value: user.email,
		onValueChange: (newValue) => {
			props.onChangeEmail(newValue);
			props.onUpdateUserFields({
				...props.user,
				email: newValue
			});
		}
	};


	const firstNameField = {
		id: 'caldera-pay-customer-first-name',
		label: 'First Name',
		desc: '',
		required: true,
		type: 'input',
		innerType: 'text',
		inputClass: 'form-control',
		value: user.first_name,
		onValueChange: (newValue) => {
			props.onUpdateUserFields({
				...props.user,
				first_name: newValue
			});
		}
	};

	const lastNameField = {
		id: 'caldera-pay-customer-last-name',
		label: 'Last Name',
		desc: '',
		required: true,
		type: 'input',
		innerType: 'text',
		inputClass: 'form-control',
		value: user.last_name,
		onValueChange: (newValue) => {
			props.onUpdateUserFields({
				...props.user,
				last_name: newValue
			});
		}
	};

	const configFields = [
		emailField
	];


	if( user.id ){
		configFields.push(firstNameField);
		configFields.push(lastNameField)
	}
	return (
		<div>
			<RenderGroup
				configFields={configFields}
				className={'caldera-pay-customer-information'}
			/>
		</div>
	);
};
