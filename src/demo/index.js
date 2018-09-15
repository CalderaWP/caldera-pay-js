import {factory} from "../lib";
import domReady from '@wordpress/dom-ready';
//https://app-dev.qualpay.com/hosted/embedded/js/qp-embedded-sdk.min.js
const loadScript = require('simple-load-script');

domReady(  () => {
	const domNodeId= 'root';
	const calderaPaySystem = factory({},domNodeId, 'https://calderaformscom.lndo.site/wp-json' );


} );

