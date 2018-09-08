import React from 'react';
import {CalderaPay} from "../lib";

const App = () => (
	<CalderaPay
		settings={{
			apiRoot: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
			cartRoute: 'https://calderaformscom.lndo.site/wp-json/calderapay/v1/cart',
			checkoutLink: 'https://calderaformscom.lndo.site/checkout',
			bundleOrder: [
				'isFree',
				20520, //Individual
				20518, //Advanced
				48255, //Agency
			]
		}}

	/>
);

export default App;
