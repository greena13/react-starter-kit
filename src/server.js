import koa from 'koa';
import Pug from 'koa-pug';
import fetch from 'isomorphic-fetch';

import queryString from 'query-string';
import _ from 'lodash';

import React from 'react';
import ReactDOM from 'react-dom/server';

import assets from './assets';

import { match, RouterContext } from 'react-router';
import { Provider }  from 'react-redux';

import configureStore from './store';
import ApplicationRoutes from './routes/ApplicationRoutes';
import ButtonColors from './constants/ButtonColors';

// environment variable names
function htmlTemplateVariables(htmlContent = '', initialState = {}) {
  return {
    htmlContent,
    initialState: JSON.stringify(initialState),
    assetsUrl: process.env.ASSETS_PATH,
    assets: assets,
    productionBuild: process.env.NODE_ENV === 'production'
  };
}

try {
  const server = koa();
  const port = process.env.SERVER_PORT;
  let routes = ApplicationRoutes;

  new Pug({
    viewPath: __dirname + '/views',
    app: server
  });

  server.use(function *() {
    yield ((callback) => {
      const location  = this.path;

      match({routes, location}, (error, redirectLocation, renderProps) => {
        if (redirectLocation) {

          this.redirect(redirectLocation.pathname + redirectLocation.search, '/');

        } else if (error || !renderProps) {

          callback(error);

        } else {

          const initialState = { button: { color: ButtonColors.BLUE }};

          const htmlContent = ReactDOM.renderToString(
            <Provider store={configureStore(initialState)}>
              <RouterContext {...renderProps} />
            </Provider>
          );

          this.render('index', htmlTemplateVariables(htmlContent, initialState), true);

          callback(null);
        }
      });
    });
  });

  server.listen(port, () => {
    const { assetsUrl } = htmlTemplateVariables();

    console.info('Server is listening on port %s.', process.env['SERVER_PORT']);
    console.info('- This can be changed using %s=port', 'SERVER_PORT');
    console.info('');
    console.info('Using asset path "%s"', assetsUrl);
  });

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      console.log('[HMR] Waiting for server-side updates');

      module.hot.accept('routes/ApplicationRoutes', () => {
        routes = require('routes/ApplicationRoutes');
      });

      module.hot.addStatusHandler((status) => {
        if (status === 'abort') {
          setTimeout(() => process.exit(0), 0);
        }
      });
    }
  }

} catch (error) {
  console.error(error.stack || error);
  throw error;
}
