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
	jwtToken: ?string,
	onValidateToken: Function
}
type State = {
	user: WordPressUser,
	hasLoaded: boolean,
	userFound: boolean,
	password: string
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
		userFound: false,
	};

	/** @inheritDoc **/
	constructor(props: Props) {
		super(props);
		(this: any).setUserEmail = this.setUserEmail.bind(this);
		(this: any).updateUserFields = this.updateUserFields.bind(this);


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
				this.setState({hasLoaded: true, userFound: true});
			});
	}

	requestLogin() {
		const settings = this.props.settings;
		const {jwtLoginRoute} = settings;
		this.setState({hasLoaded: false});
		fetch(`${jwtLoginRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'POST',
			headers: requestHeaders(this.props.jwtToken),
			body: JSON.stringify({
				username: this.state.user.username,
				password: this.state.password
			})

		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then((response) => {
				console.log(response);
				this.props.onValidateToken(response.token);
				this.setState({hasLoaded: true, userFound: true});
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
			.catch(error => console.error('Error:', error))
			.then(response => {
				console.log(response);
				if (response.hasOwnProperty('exists') && response.exists) {
					this.setState({userFound:true})
				}
				this.setState({hasLoaded: true});
			});
	}

	setUserEmail(email: string) {
		const {user} = this.state;
		this.setState({
			user: {
				...user,
				email
			}
		});

		if (email !== this.state.user.email && !this.state.userFound) {
			if (isEmailMaybe(email)) {
				this.deboundedRequestUserExists();
			}

		}

	}

	setPassword(password: string) {
		this.setState({password});
	}

	updateUserFields(user: WordPressUser) {
		this.setState({user});
	}



	render() {
		const {user, hasLoaded} = this.state;
		//const showPassword = !!this.state.password.length;
		const showPassword = true;
		return (
			<div>
				{hasLoaded &&
					<Spinner/>
				}
				<UserInfo
					user={user}
					onChangeEmail={this.setUserEmail}
					onUpdateUserFields={this.updateUserFields}
					onLoginAttempt={this.setPassword}
					showPassword={showPassword}
				/>
			</div>
		)

	}
}