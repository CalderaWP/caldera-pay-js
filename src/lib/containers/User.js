// @flow
import React, {Component} from 'react';
import {UserInfo} from "../components/UserInfo";
import type {WordPressUser} from "../types/WordPress";
import type{ CalderaPayUserSettings} from "../types";
import {Spinner} from '@wordpress/components'
import {requestHeaders} from "../api/requestHeaders";
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
export class User extends Component<Props,State> {

	state: State = {
		user: {
			id:0,
			username:'',
			name: '',
			first_name: '',
			last_name: '',
			email: ''
		},
		hasLoaded: true,
		userFound: false,
		password: ''
	};
	/** @inheritDoc **/
	constructor(props: Props){
		super(props);
		(this: any).setUserEmail = this.setUserEmail.bind(this);
		(this: any).updateUserFields = this.updateUserFields.bind(this);
		(this: any).setUser = this.setUser.bind(this);
		(this: any).setPassword = this.setPassword.bind(this);

	}


	setUser(user: WordPressUser){
		this.setState({user});
	}


	requestTokenValidate(){
		const settings = this.props.settings;
		const {jwtValidateRoute} = settings;
		this.setState({hasLoaded:false});
		fetch(`${jwtValidateRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'POST',
			headers: requestHeaders(this.props.jwtToken),
		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then((response) => {
				this.props.onValidateToken(response.token);
				this.setState({hasLoaded:true,userFound:true});
			});
	}

	requestLogin(){
		const settings = this.props.settings;
		const {jwtLoginRoute} = settings;
		this.setState({hasLoaded:false});
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
				this.setState({hasLoaded:true,userFound:true});
			});
	}

	requestUserExists(){
		const settings = this.props.settings;
		const {userExistsRoute} = settings;
		this.setState({hasLoaded:false});
		fetch(`${userExistsRoute}`, {
			mode: 'cors',
			redirect: 'follow',
			method: 'GET',
			headers: requestHeaders(this.props.jwtToken)


		}).then(response => response.json())
			.catch(error => console.error('Error:', error))
			.then(response => {
				console.log(response);
				this.setState({hasLoaded:true});
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
		if( email !== this.state.user.email && ! this.state.userFound ){
			this.requestUserExists();
		}
	}

	setPassword(password:string){
		this.setState({password});
	}

	updateUserFields(user: WordPressUser){
		this.setState({user});
	}

	render()
	{
		const {user,hasLoaded} = this.state;
		return(
			<div>
				{hasLoaded &&
					<Spinner/>
				}
				<UserInfo
					user={user}
					onChangeEmail={this.setUserEmail}
					onUpdateUserFields={this.updateUserFields}
				/>
			</div>
		)

	}
}