import React from "react";
import renderer from "react-test-renderer";
import {UserInfo} from "./UserInfo";
import type {WordPressUser} from "../types/WordPress";

const genericHandler = () => {};
const bundleOrder = [
	'isFree',
	20520, //Individual
	20518, //Advanced
	48255, //Agency
];

describe( 'UserInfo component', () => {
	const user = {
		id: 0,
		username: '',
		name: '',
		first_name: '',
		last_name: '',
		email: ''
	}
	it('Does not show password when told not to', () => {
		const component = renderer.create(<UserInfo
				user={user}
				onChangeEmail={genericHandler}
				onUpdateUserFields={genericHandler}
				onLoginAttempt={genericHandler}
				showPassword={false}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});

	it('Does show password when told  to', () => {
		const component = renderer.create(<UserInfo
				user={user}
				onChangeEmail={genericHandler}
				onUpdateUserFields={genericHandler}
				onLoginAttempt={genericHandler}
				showPassword={true}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});

	it('Does show first name and last name fields with first name and last name if provided', () => {
		let knownUser = {
			...user,
			first_name: 'Roy',
			last_name: 'Sivan'
		}
		const component = renderer.create(<UserInfo
				user={knownUseru}
				onChangeEmail={genericHandler}
				onUpdateUserFields={genericHandler}
				onLoginAttempt={genericHandler}
				showPassword={true}
			/>
		);
		expect(component.toJSON()).toMatchSnapshot();
	});


});




