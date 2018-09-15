import React from 'react';
import {CalderaPay} from "../lib";
import {userSettingsFactory} from '../lib';
const apiRoot = 'https://calderaformscom.lndo.site/wp-json/wp/v2/download';
const userSettings = userSettingsFactory(apiRoot);
const App = () => (
	<CalderaPay
		settings={{
			productsRoute: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
			cartRoute: 'https://calderaformscom.lndo.site/wp-json/calderapay/v1/cart',
			checkoutLink: 'https://calderaformscom.lndo.site/checkout',
			bundleOrder: [
				'isFree',
				20520, //Individual
				20518, //Advanced
				48255, //Agency
			]
		}}
		userSettings={userSettings}

	/>
);

export default App;
