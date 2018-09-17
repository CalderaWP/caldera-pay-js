# Caldera Pay JavaScript Client


This library's boilerplate is [DimiMikadze/create-react-library](https://github.com/DimiMikadze/create-react-library)


## Requirements
A WordPress site with:
* WordPress 4.9.6 +
* PHP 7.0 +
* Caldera Pay WordPress Client Plugin
    ** Currently only exists on CalderaForms.com caldera-pay branch, will be externalized soon
* Easy Digital Downloads
* Caldera Forms

## Install

* Install using npm:
`npm i caldera-labs/caldera-pay-js`

* Install with yarn:

`yarn add caldera-labs/caldera-pay-js`

## Usage
There is a factory function to load app.
```js
import {factory} from '@caldera-labs/caldera-pay-js';
import domReady from '@wordpress/dom-ready';

domReady( () => {
	factory({},'caldera-pay-app');
} );
```

This assumes an HTML markup like this:

```html
<div class="caldera-pay">
    <div class="container">
       <div class="row">
         <div class="col-sm-12 col-lg-6" id="caldera-pay-left"></div>
         <div class="col-sm-12 col-lg-6" id="caldera-pay-right"></div>
       </div>
       <div id="caldera-pay-app"></div>
     </div>
</div>
```

Or you can use the component.
```js
import React from 'react';
import './App.css';
import {
	CalderaPay, //main component
	apiSettingsFactory, // main settings
	userSettingsFactory, //user settings
	ApiClient, // Client for all API requests
	qualpayEmbeddedFields, //manages loading qualpay hosted fields
}from '@caldera-labs/caldera-pay-js';

//URL for the WordPress REST API
const apiRootUrl = 'https://calderaformscom.lndo.site/wp-json';
const settings=  apiSettingsFactory({
    //overides for settings
}, apiRootUrl );
const userSettings = userSettingsFactory(apiRootUrl);

const App = () => (
	<CalderaPay
		userSettings={userSettings}
		settings={settings}
		leftTopDomNode={document.getElementById('left-top')}
        rightTopDomNode={document.getElementById('right-top')}
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

Must be [logged in as project maintainer via npm cli](https://docs.npmjs.com/cli/adduser)

### Prepare Release

* Patch release:
    - `yarn release`

* Minor release:
    - `yarn release:minor`

* Major release:
    - `yarn release:major`

### Publish To NPM
`npm publish`

