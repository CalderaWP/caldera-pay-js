// @flow
import React, {Component} from 'react';
import {UserInfo} from "../components/UserInfo";
import type {WordPressUser} from "../types/WordPress";
import type{CalderaPayUserSettings} from "../types";
import {Spinner} from '@wordpress/components'
import {requestHeaders} from "../api/requestHeaders";
import {debounce} from 'debounce';
import {addQueryArgs} from '@wordpress/url';

const isEmailMaybe = require('is-email-maybe')

type Props = {
	settings: CalderaPayUserSettings,
	jwtToken: string,
	onValidateToken: Function,
	loginMessage: string
}
type State = {
	user: WordPressUser,
	hasLoaded: boolean,
	userExists: boolean,
	userNotFound: boolean,
	loginMessage: string
}

export class User extends Component<Props, State> {

	state: State = {
		user: {
			id: 0,
			username: '',
			name: '',
			first_name: '',
			last_name: '',
			email: ''
		},
		hasLoaded: true,
		userExists: false,
		userNotFound: false,
		loginMessage: ''
	};

	/** @inheritDoc **/
	constructor(props: Props) {
		super(props);
		(this: any).setUserEmail = this.setUserEmail.bind(this);
		(this: any).updateUserFields = this.updateUserFields.bind(this);
		(this: any).shouldShowLogin = this.shouldShowLogin.bind(this);
		(this: any).onLoginClick = this.onLoginClick.bind(this);


		(this: any).requestTokenValidate = this.requestTokenValidate.bind(this);
		(this: any).deboundedRequestTokenValidate = debounce(this.requestTokenValidate,500).bind(this);


		(this: any).requestUserExists = this.requestUserExists.bind(this);
		(this: any).deboundedRequestUserExists = debounce(this.requestUserExists,500).bind(this);

		(this: any).requestLogin = this.requestLogin.bind(this);
		(this: any).deboundedRequestLogin = debounce(this.requestLogin,500).bind(this);


		//this.delayedCallback = _.debounce(this.ajaxCall, 1000);


	}


	setUser(user: WordPressUser) {
		this.setState({user});
	}

	/**
	 * Display password logic
	 *
	 * Sser exists OR token is set
	 *
	 * @return {State.userExists|boolean}
	 */
	shouldShowLogin(): boolean{
		const {userExists} = this.state;
		const {jwtToken} = this.props;
		if (
			//User exists
			// can login
			userExists &&
			//and JWT token is not set
			//Did not login
			0 === jwtToken.length ){
			return true;
		}

		return false;
	}

	requestTokenValidate() {
		const settings = this.props.settings;
		const {jwtValidateRoute} = settings;
		this.setState({hasLoaded: false});
		fetch(`${jwtValidateRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'POST',
			headers: requestHeaders(this.props.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then((response) => {
				this.props.onValidateToken(response.token);
				this.setState({hasLoaded: true, userExists: true});
			});
	}

	requestLogin(password:string) {
		const settings = this.props.settings;
		const {user} = this.state;
		const {jwtLoginRoute} = settings;
		this.setState({hasLoaded: false});
		fetch(`${jwtLoginRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'POST',
			headers: requestHeaders(this.props.jwtToken),
			body: JSON.stringify({
				username: user.username ? user.username : user.email,
				password
			})

		}).then(response => response.json())
			.catch(error => {
				console.log(error);
				if( error.hasOwnProperty('message') && 'string' === typeof  error.message ){
					this.setState({
						loginMessage: error.message
					});
				}
			})
			.then((response) => {
				let stateUpdate = {
					hasLoaded: true,
					userExists: false,
					loginMessage: '',
					user: this.state.user
				};
				if( response.hasOwnProperty('token') && 'string' === typeof  response.token ){
					this.props.onValidateToken(response.token);
					stateUpdate.userExists = true;
					stateUpdate.loginMessage = 'Login Successful';

				}else{

					if( response.hasOwnProperty('message') && 'string' === typeof  response.message ){
						stateUpdate.loginMessage = response.message;
					}

				}

				if( response.hasOwnProperty('calderaPay')){
					const {calderaPay} = response;
					this.setState({
						user: {
							...user,
							first_name: calderaPay.hasOwnProperty('first_name' ) ? calderaPay.first_name : 	this.state.user.first_name,
							last_name: calderaPay.hasOwnProperty('last_name' ) ? calderaPay.last_name : 	this.state.user.last_name,
						}
					})
				}
				this.setState(stateUpdate);
			});
	}

	requestUserExists() {
		const {user} = this.state;
		const settings = this.props.settings;
		const {userExistsRoute} = settings;
		this.setState({hasLoaded: false});
		fetch(addQueryArgs(userExistsRoute, {email: user.email}), {
			mode: 'cors',
			redirect: 'follow',
			cache: "default",
			headers:requestHeaders(this.props.jwtToken),

		}).then(response => response.json())
			.catch(error => {this.setState({userNotFound:true})})
			.then(response => {
				if (response.hasOwnProperty('exists') && response.exists) {
					this.setState({userExists:true,userNotFound:false})
				}
				this.setState({hasLoaded: true});
			});
	}

	setUserEmail(email: string) {
		const {user,userExists} = this.state;
		this.setState({
			user: {
				...user,
				email
			}
		});

		if (email !== user.email && !userExists) {
			if (isEmailMaybe(email)) {
				this.deboundedRequestUserExists();
			}

		}

	}

	onLoginClick(password: string) {
		this.requestLogin(password);
	}

	updateUserFields(user: WordPressUser) {
		this.setState({user});
	}



	render() {
		const {user, hasLoaded,loginMessage} = this.state;
		return (
			<div>
				{hasLoaded &&
					<Spinner/>
				}
				<UserInfo
					user={user}
					onChangeEmail={this.setUserEmail}
					onUpdateUserFields={this.updateUserFields}
					onLoginAttempt={this.onLoginClick}
					showPassword={this.shouldShowLogin()}
				/>
				<p>{loginMessage}</p>
			</div>
		)

	}
}