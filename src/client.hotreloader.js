'use strict';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import clientConfig from '../config/webpack.client.development';

const compiler = webpack(clientConfig);
const devServer = new WebpackDevServer(compiler, clientConfig.devServer);

devServer.listen(clientConfig.port, ()=>{
  console.log(`The webpack dev server is running at ${clientConfig.url}`);
});

