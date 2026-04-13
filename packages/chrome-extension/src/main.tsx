import 'vite/modulepreload-polyfill';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RscDevtoolsExtension } from './RscDevtoolsExtension.jsx';

try {
  if (typeof process === 'undefined') {
    process = {
      // @ts-expect-error Overriding process is meant to be done
      env: 'development',
    };
  }
} catch (error) {
  console.log('error', error);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RscDevtoolsExtension />
  </React.StrictMode>,
);
