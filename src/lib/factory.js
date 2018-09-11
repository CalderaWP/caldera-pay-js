// @flow
import type {CalderaPaySettings} from "./types";
import React from 'react';
import {CalderaPay} from "./components/CalderaPay";
import ReactDOM from 'react-dom';


/**
 * Renders the application onto a given DOM node.
 *
 *
 * @param settings
 * @param domNodeId
 */
export const factory = (settings: CalderaPaySettings, domNodeId : string ) => {
	settings = {
		...settings,
		apiRoot: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
			cartRoute: 'https://calderaformscom.lndo.site/wp-json/calderapay/v1/cart',
		checkoutLink: 'https://calderaformscom.lndo.site/checkout',
		bundleOrder: [
			'isFree',
			20520, //Individual
			20518, //Advanced
			48255, //Agency
		]
	};
	ReactDOM.render(<CalderaPay
		settings={settings}
	/>, document.getElementById(domNodeId));
};