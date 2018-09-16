// @flow
import type {CalderaPayUserSettings} from "../types";

function addApiRoot(apiRoot:string,endpoint:string):string{
	return `${apiRoot}/${endpoint}`;
}

export function userSettingsFactory(apiRoot:string) : CalderaPayUserSettings  {
	return {
		userExistsRoute: addApiRoot(apiRoot,'calderapay/v1/user/exists'),
		jwtLoginRoute: addApiRoot(apiRoot,'jwt-auth/v1/token'),
		jwtValidateRoute: addApiRoot(apiRoot,'jwt-auth/v1/token/validate')
	};
}