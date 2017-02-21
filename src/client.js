/*
  React and React Dom for rendering the React application
 */

import React from 'react';
import { render } from 'react-dom';

/*
 Functional programming utility useful for enumeration and iteration
 */

import _ from 'lodash';

/*
  React router utilities for matching routes to react component trees
 */

import { match, Router, browserHistory, applyRouterMiddleware }  from 'react-router';

/*
 React Redux component responsible for placing a reference to the redux
 store on context so it can be used by all container components in the
 render tree to get the data that they need
 */

import { Provider }  from 'react-redux';

/*
  Utility for reducing the press response time on mobile devices, to make
  the app appear more responsive
 */

import FastClick from 'fastclick';

/*
 Contains the list of routes for the application that React Router will
 use to match incoming requests to component trees
 */

import routes from './routes/ApplicationRoutes';

/*
  Normalise css file for more consistent CSS styling across different browsers
 */

import './base.global.less';

/*
 Loads the redux store and configuration appropriate for the nominated
 environment
 */

import configureStore from './store';

/*
  Synchronises the browser history with the location recorded in the redux store
 */
import { syncHistoryWithStore } from 'react-router-redux';

/*
  Resets the scroll position when a route changes
 */

import { useScroll } from 'react-router-scroll';

/*
  Create a new store, with the contents extracted from the window (put there
  by the index pud template when the node server sent the initial response)
 */
const store = configureStore(window.__INITIAL_STATE__);

/*
  Synchronises the browser history with what has been recorded in the store
 */

const history = syncHistoryWithStore(browserHistory, store);

/*
  Function to be run once the document.body has loaded
 */

function run() {

  FastClick.attach(document.body);

  /*
    Match the path recorded in the store against the application routes to
    determine the React component tree to render
   */

  match({ routes, history }, (error, redirectLocation, renderProps) => {

    /*
      Mount the React application on the div #main. The Provider component
      ensures all React elements have access to store on context. Router
      component renders the component tree matched to the route and the
      useScroll middleware resets the scroll location when moving between
      routes in the browser.

      Also, render the Redux developer tools if running in development.
     */

    render(
      <div>
        <Provider store={store}>
          <Router {...renderProps} render={ applyRouterMiddleware(useScroll()) } />
        </Provider>

        { renderDevTools() }

      </div>,

      document.getElementById('main')
    );
  });
}

function renderDevTools() {

  /*
    In development, load and mount the redux developer tools
   */

  if (process.env.NODE_ENV !== 'production') {
    const DevTools = require('./components/DevTools');

    return(
      <DevTools store={ store }/>
    );
  }
}

/*
  Run the application when both DOM is ready and page content is loaded
 */

if (_.includes(['complete', 'loaded', 'interactive'], document.readyState) && document.body) {
  run();
} else {
  document.addEventListener('DOMContentLoaded', run, false);
}
