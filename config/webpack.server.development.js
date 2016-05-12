'use strict';

var path = require('path');
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');

var clientConfig = require('./webpack.client.development');

const port = 8082;
const host = 'http://localhost';

module.exports = {
  port,
  host,

  entry: './src/server.js',

  output: {
    path: path.join(__dirname, '../build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    publicPath: clientConfig.url
  },

  target: 'node',

  externals: [
    /^\.\/assets$/,
    function filter(context, request, callback) {
      const isExternal = request.match(/^[@a-z][a-z\/\.\-0-9]*$/i);
      callback(null, Boolean(isExternal));
    }
  ],

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  cache: true,
  debug: true,

  module: {
    noParse: /\.min\.js/,

    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css/,
        loader: 'style!css!postcss-loader'
      },

      {
        test: /^((?!\.global).)*\.less$/,
        loader: 'css-loader/locals?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /\.global\.less$/,
        loader: 'css-loader/locals?localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /\.json$/,
        loader: 'json-loader'
      },

      {
        test: /\.txt$/,
        loader: 'raw-loader'
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      },

      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        SERVER_PORT: '"' + port + '"',
        SERVER_HOST: '"' + host + '"',
        ASSETS_PATH: '"' + clientConfig.url + '"'
      }
    }),

    new CopyWebpackPlugin([
      { from: 'src/views', to: 'views' }
    ]),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
