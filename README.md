# Caldera Pay JavaScript Client


This library's boilerplate is [DimiMikadze/create-react-library](https://github.com/DimiMikadze/create-react-library)

## Usage
There is a factory function to load app 
```js
import {factory} from "../lib";
import domReady from '@wordpress/dom-ready';

domReady( () => {
	factory({},'root');
} );
```

Or you can use the component.
```js
import React from 'react';
import './App.css';
import {CalderaPay,userSettingsFactory} from '@caldera-labs/caldera-pay-js';
const userSettings = userSettingsFactory('https://calderaformscom.lndo.site');

const App = () => (
	<CalderaPay
		userSettings={userSettings}
		settings={{
			apiRoot: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
			cartRoute: 'https://calderaformscom.lndo.site/wp-json/calderapay/v1/cart',
			checkoutLink: 'https://calderaformscom.lndo.site/checkout',
			bundleOrder: [
				'isFree',
				20520, //Individual
				20518, //Advanced
				48255, //Agency
			],

		}}
	/>
);

export default App;

```

## Development

Clone repo

````
git clone https://github.com/DimiMikadze/create-react-library.git
````

Install dependencies

`npm install` or `yarn install`

Start development server

`npm start` or `yarn start`

Runs the demo app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Library files

All library files are located inside `src/lib`  

## Demo app

Is located inside `src/demo` directory, this is the demo of the library, and useful for development

## Testing

`yarn run test`

## Build library

`yarn run build`

Produces production version of library under the `build` folder.

## Publish library

`npm publish`


