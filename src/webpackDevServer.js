/*
  Webpack itself. Used for creating the bundle and notifying the webpack dev
  server that there is updated code to deliver to the browser.
 */

import webpack from 'webpack';

/*
  Webpack dev server. Server that initially delivers the client bundle and then
  sends updates to the browser whenever webpack indicates there is a new version
  available.
 */

import WebpackDevServer from 'webpack-dev-server';

/*
  Configuration file how to build the client bundle
 */

import clientConfig from '../config/webpack.client.development.babel';

/*
  Configuration file for the webpack dev server
 */

import webpackDevServerConfig from '../config/webpackDevServer.development.babel';

const compiler = webpack(clientConfig);
const devServer = new WebpackDevServer(compiler, webpackDevServerConfig.devServerOptions);

devServer.listen(webpackDevServerConfig.devServerOptions.port, ()=>{
  console.info('');
  console.info(`🔬  Webpack Development Server mounted on ${webpackDevServerConfig.customOptions.fullUrl}`);
  console.info('---------------------------------------------------------------');
  console.info('⏳  Waiting for client bundle to build . . .');
  console.info('');
});

