'use strict';

var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var autoPrefixer = require('autoprefixer');

const port = 8083;
const host = 'http://localhost';
const url = host + ':' + port + '/';

module.exports = {
  url,
  port,

  entry: {
    main: [
      'webpack-dev-server/client?' + url,
      'webpack/hot/dev-server',
      './src/client.js'
    ]
  },

  output: {
    path: path.join(__dirname, '../build'),
    filename: '[name].js',
    publicPath: url
  },

  devtool: 'eval',

  devServer: {
    hot: true,
    contentBase: './build/' ,
    historyApiFallback: true,
    stats: {
      colors: true
    }
  },

  node: {
    net: 'empty',
    dns: 'empty'
  },

  eslint: {
    failOnWarning: false,
    failOnError: false
  },

  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],

    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

      {
        test: /\.css$/,
        loader: 'style!css-loader?&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /^((?!\.global).)*\.less$/,
        loader: 'style!css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /\.global\.less$/,
        loader: 'style!css!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version'
      },

      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader'
      },

      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader?limit=10000'
      },

      {
        test: /\.(eot|ttf|wav|mp3)$/,
        loader: 'file-loader'
      },

      {
        test: /\.ico$/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),

    new AssetsPlugin({
        path: path.join(__dirname, '../build'),
        filename: 'assets.js',
        processOutput: x => `module.exports = ${JSON.stringify(x)};`
    }),

    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  postcss: function() {
    return [autoPrefixer];
  }
};
