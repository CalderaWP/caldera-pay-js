// @flow
import type {CalderaPaySettings} from "./types";
import React from 'react';
import {CalderaPay} from "./components/CalderaPay";
import ReactDOM from 'react-dom';
import {userSettingsFactory} from "./util/userSettingsFactory";
import {apiSettingsFactory} from "./util/apiSettingsFactory";
import {ApiClient} from "./api/ApiClient";
import {qualPay} from "./qualPay";

/**
 * Renders the application onto a given DOM node.
 *
 *
 * @param settings
 * @param domNodeId
 */
export const factory = (settings: CalderaPaySettings, domNodeId : string, apiRoot: string ) : [ApiClient] => {
	apiRoot = apiRoot ? apiRoot : 'https://calderaformscom.lndo.site/wp-json';
	settings = apiSettingsFactory(settings,apiRoot);
	const userSettings = userSettingsFactory(apiRoot);
	//@TODO not pass settings to component that are also needed
	const apiClient = new ApiClient(settings,userSettings);
	ReactDOM.render(<CalderaPay
		apiClient={apiClient}
		settings={settings}
		userSettings={userSettings}
	/>, document.getElementById(domNodeId));

	qualPay(
		'caldera-pay-qualpay-form',
		{
			merchantId:212000464573,
			mode: 'test',
			domNodeId
		},
		apiClient
	).putFormOnDom().loadCheckout();

	return [apiClient];
};