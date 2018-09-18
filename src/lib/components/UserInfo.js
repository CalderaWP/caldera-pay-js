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

	/**
	 * Set password in state
	 *
	 * @param password
	 */
	setPassword(password:string){
		this.setState({password});
	}

	/**
	 * Call onLoginAttempt, passing password from state
	 */
	handleLogin(){
		this.props.onLoginAttempt(this.state.password);
	}


	/** @inheritDoc**/
	render() {

		const {props,state} = this;
		const {showPassword,user} = props;
		//@todo solve this problem in components library
		const fullWidthClassName = 'col-sm-12';
		const halfWidthClassName =  'col-sm-12 col-md-6';
		const emailClassName = showPassword ? halfWidthClassName : fullWidthClassName;



		const emailField = {
			id: 'caldera-pay-customer-email',
			label: 'Email Address',
			desc: 'If you have an account on CalderaForms.com enter the email you used. If not, we\'ll create one for you! (required)',
			type: 'input',
			required: true,
			innerType: 'email',
			fieldClassName: 'form-control',
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
			fieldClassName: 'form-control',
			value: state.password,
			onValueChange: (newValue) => {
				this.setPassword(newValue);
			}
		};


		const firstNameField = {
			id: 'caldera-pay-customer-first-name',
			label: 'First Name',
			desc: 'Your first name (required)',
			required: true,
			type: 'input',
			innerType: 'text',
			fieldClassName: 'form-control',
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
			fieldClassName: 'form-control',
			value: user.last_name,
			onValueChange: (newValue) => {
				props.onUpdateUserFields({
					...props.user,
					last_name: newValue
				});
			}
		};



		return (
			<div
				className={'caldera-pay-customer-information'}
			>
				<div className={'row'}>
					<RenderGroup
						configFields={[emailField]}
						className={emailClassName}
					/>
					{ showPassword &&
						<div className="caldera-config-group">
							<div className="caldera-config-field">
									<label
										htmlFor="caldera-pay-customer-password"
									>
										Password
									</label>
								<input
									type="password"
									id="caldera-pay-customer-email"
									className="field-config field-config"
									aria-describedby="caldera-pay-customer-password-description"
									value={state.password}
									onChange={(event) => {
										this.setPassword(event.target.value);
									}}
								/>
								<p
									id="caldera-pay-customer-email-description"
									className="description"
								>
									Your CalderaForms.com Password (Required)
								</p>
							</div>
						</div>

					}

				</div>

				<div className={'row'}>
					<RenderGroup
						configFields={[firstNameField]}
						className={halfWidthClassName}
					/>
					<RenderGroup
						configFields={[lastNameField]}
						className={halfWidthClassName}
					/>
				</div>

				{props.showPassword &&
					<div className={'row'}>
						<button
							className={'btn-green'}
							onClick={this.handleLogin}>
							Login
						</button>
					</div>

				}
			</div>
		);
	}
};
