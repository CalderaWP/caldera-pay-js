// @flow
import React from 'react';
import {RenderGroup} from '@caldera-labs/components';
import type {WordPressUser} from "../types/WordPress";

type Props = {
	user: 	WordPressUser,
	onChangeEmail: Function,
	onUpdateUserFields: Function,
	onLoginAttempt: Function,
	showPassword: boolean
};
type State = {
	password: string
}
/**
 * Displays product cart
 * @param {Props} props
 * @return {*}
 * @constructor
 */
export class UserInfo extends React.Component<Props,State> {
	state = {
		password:''
	};
	/** @inheritDoc **/
	constructor(props: Props) {
		super(props);
		(this: any).setPassword = this.setPassword.bind(this);
		(this: any).handleLogin = this.handleLogin.bind(this);
	}

	setPassword(password:string){
		this.setState({password});
	}

	getConfigFields(){
		const {props,state} = this;
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


		const passField = {
			id: 'caldera-pay-customer-password',
			label: 'Password',
			desc: 'Account Found Enter Password',
			type: 'input',
			required: true,
			innerType: 'password',
			inputClass: 'form-control',
			value: state.password,
			onValueChange: (newValue) => {
				this.setPassword(newValue);
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
			required: false,
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

		if( props.showPassword ){
			configFields.push(passField);
		}



		configFields.push(firstNameField);
		configFields.push(lastNameField);


		return configFields;
	}

	handleLogin(){
		this.props.onLoginAttempt(this.state.password);
	}
	render() {
		const {props} = this;

		return (
			<div>
				<RenderGroup
					configFields={this.getConfigFields()}
					className={'caldera-pay-customer-information'}
				/>
				{props.showPassword &&
					<button onClick={this.handleLogin}>Login</button>

				}
			</div>
		);
	}
};
