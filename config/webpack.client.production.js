'use strict';

var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require('autoprefixer');

const destFolderName = '/public/';

module.exports = {
  entry: {
    main: './src/client.js'
  },

  output: {
    path: './build' + destFolderName,
    filename: '[name].[hash].js',
    publicPath: process.env.ASSETS_PATH || destFolderName
  },

  node: {
    net: 'empty',
    dns: 'empty'
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
        loader: ExtractTextPlugin.extract('style!css-loader?&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader')
      },

      {
        test: /^((?!\.global).)*\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]&importLoaders=1!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version')
      },

      {
        test: /\.global\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss-loader!less?indentedSyntax=true&outputStyle=expanded&browsers=last 2 version')
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
        NODE_ENV: '"production"'
      }
    }),

    new ExtractTextPlugin('[name].[chunkhash].css'),

    new AssetsPlugin({
      path: path.join(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`
    }),

    new CleanWebpackPlugin(['build'], {
      root: path.join(__dirname, '../'),
      verbose: true
    }),

    new CopyWebpackPlugin([
      { from: 'src/favicon.ico', to: 'favicon.ico' }
    ]),

    new CompressionPlugin({
      test: /\.js$/,
      minRatio: 0.8
    }),

    new webpack.optimize.OccurenceOrderPlugin(),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }),

    new webpack.optimize.AggressiveMergingPlugin()
  ],

  postcss: function() {
    return [autoprefixer];
  }
};
