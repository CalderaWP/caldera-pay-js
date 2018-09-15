import type {CalderaPaySettings} from "../types";

/**
 * Factory for API settings
 * @param settings
 * @param apiRoot
 * @return {CalderaPaySettings}
 */
export function apiSettingsFactory(settings: CalderaPaySettings,apiRoot:string) {

	function addApiRoot(endpoint:string):string{
		return `${apiRoot}/${endpoint.replace(/^\/|\/$/g, '')}`;
	}

	const nameSpace = 'calderapay/v1';

	function addApiRootAndNamespace(endpoint:string):string{
		return `${apiRoot}/${nameSpace}/${endpoint.replace(/^\/|\/$/g, '')}`;
	}
	settings = {
		...settings,
		productsRoute: addApiRoot('wp/v2/download'),
		cartRoute: addApiRootAndNamespace('cart'),
		embeddedApi: {
			keyRoute: addApiRootAndNamespace( 'pay/qualpay/key'),
			paymentRoute: addApiRootAndNamespace( 'pay/qualpay'),
		},
		checkoutLink: 'https://calderaformscom.lndo.site/checkout',
		bundleOrder: [
			'isFree',
			20520, //Individual
			20518, //Advanced
			48255, //Agency
		]
	};

	return settings;
}