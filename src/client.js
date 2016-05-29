import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash';

import { match, Router, browserHistory }  from 'react-router';
import { Provider }  from 'react-redux';

import FastClick from 'fastclick';

import ApplicationRoutes from './routes/ApplicationRoutes';

import './base.global.less';

import configureStore from './store';

function run() {
  FastClick.attach(document.body);

  const { pathname, search } = window.location;
  const location = `${pathname}${search}`;

  match({ routes: ApplicationRoutes, location, history: browserHistory }, (error, redirectLocation, renderProps) => {
    const store = configureStore(window.__INITIAL_STATE__);

    render(
      <Provider store={store}>
        <Router {...renderProps} />
      </Provider>,

      document.getElementById('main')
    );

    if (process.env.NODE_ENV !== 'production') {
      const showDevTools = require('./showDevTools');
      showDevTools(store);
    }
  });
}

// Run the application when both DOM is ready and page content is loaded
if (_.includes(['complete', 'loaded', 'interactive'], document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
