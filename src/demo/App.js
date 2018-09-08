import React from 'react';
import {CalderaPay} from "../lib";

const App = () => (
  <div>
      <CalderaPay
            settings={{
				apiRoot: 'https://calderaformscom.lndo.site/wp-json/wp/v2/download',
				bundleOrder: [
					'isFree',
					20520, //Individual
					20518, //Advanced
					48255, //Agency
				]
			}}

      />
  </div>
);

export default App;
