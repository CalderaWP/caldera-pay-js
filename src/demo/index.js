import {factory} from "../lib";
import domReady from '@wordpress/dom-ready';

domReady(  () => {
	const domNodeId= 'caldera-pay-app';
	factory({},domNodeId, 'https://calderaformscom.lndo.site/wp-json' );
} );

