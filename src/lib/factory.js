// @flow
import type {CalderaPaySettings} from "./types";
import React from 'react';
import {CalderaPay} from "./components/CalderaPay";
import ReactDOM from 'react-dom';
import {userSettingsFactory} from "./util/userSettingsFactory";
import {apiSettingsFactory} from "./util/apiSettingsFactory";
import {ApiClient} from "./api/ApiClient";
import {qualpayEmbeddedFields} from "./qualpayEmbeddedFields";
import {getElement} from "./util/getElement";

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
	const qualpay = new qualpayEmbeddedFields(
		'caldera-pay-qualpay-form',
		{
			merchantId:212000464573,
			mode: 'test',
			domNodeId
		},
		apiClient
	);


	const leftTopDomNode = getElement('caldera-pay-left');
	const rightTopDomNode = getElement('caldera-pay-right');
	const topBarDomNode = getElement('caldera-pay-top-bar');
	ReactDOM.render(
	<CalderaPay
		apiClient={apiClient}
		settings={settings}
		userSettings={userSettings}
		qualpayEmbeddedFields={qualpay}
		leftTopDomNode={leftTopDomNode}
		rightTopDomNode={rightTopDomNode}
		topBarDomNode={topBarDomNode}
	/>, getElement(domNodeId));



	return [apiClient];
};