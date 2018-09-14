// @flow
import type {CalderaPayUserSettings} from "../types";

function addApiRoot(apiRoot:string,endpoint:string):string{
	return `${apiRoot}/${endpoint}`;
}

export function userSettingsFactory(apiRoot:string) : CalderaPayUserSettings  {
	return {
		userExistsRoute: addApiRoot(apiRoot,'wp-json/calderapay/v1/user/exists'),
		jwtLoginRoute: addApiRoot(apiRoot,'wp-json/jwt-auth/v1/token'),
		jwtValidateRoute: addApiRoot(apiRoot,'wp-json/jwt-auth/v1/token/validate')
	};
}