'use strict';

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var clientConfig = require('./webpack.client.production');

const publicPath = clientConfig.output.publicPath;

module.exports = {
  entry: './src/server.js',

  output: {
    path: path.join(__dirname, '../build'),
    filename: 'server.js',
    libraryTarget: 'commonjs2',
    publicPath
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

  module: {
    noParse: /\.min\.js/,

    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /^((?!\.global).)*\.less$/,
        loader: 'css-loader/locals!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /\.global\.less$/,
        loader: 'css-loader/locals!css?localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
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
      'process.env.NODE_ENV': '"production"'
    }),

    new CopyWebpackPlugin([
      { from: 'package.json' },
      { from: 'src/views', to: 'views' }
    ])
  ]
};
