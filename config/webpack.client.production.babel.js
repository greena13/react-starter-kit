/*
 Webpack itself. It exports plugins that are needed for the configuration file.
 */

import webpack from 'webpack';

/*
 Utility for working with file paths. Useful for when an absolute path is required
 */

import path from 'path';

/*
 Configuration object that contains output paths
 */

import webpackDevServerConfig from './webpackDevServer.development.babel';

/*
 Webpack plugin that creates a JavaScript file that exports the bundle outputs'
 filenames (which contain cache-busting hashes that depend on the bundle
 contents, so cannot be known in advance.) This json file is then used by the
 node server bundle to resolve the correct file paths to the client bundle.
 */

import AssetsPlugin from 'assets-webpack-plugin';

/*
  Plugin that cleans the build output directory to make sure no artefacts from
  earlier builds are kept around
 */

import CleanWebpackPlugin from 'clean-webpack-plugin';

/*
  Plugin that compresses the build after it has been generated for smaller file
  sizes when downloading in a browser.
 */

import CompressionPlugin from 'compression-webpack-plugin';

/*
  Plugin that collects all the references to certain filetypes and puts them in
  a separate output file that can then be downloaded in parallel with the rest
  of the bundle, reducing download time in a browser. It's used for css files
  in this configuration.

  It should be noted this is the opposite approach employed by the url-loader,
  which inlines files of a certain type and size as data urls, reducing the
  number of requests that need to be made. The Extract Text plugin creates a single
  additional file to be loaded, however, and separates out styling information
  because it effectively allows it to be applied in advance of the JavaScript
  being downloaded and executed - giving better perceived load times and allowing
  for more effective server-side rendering.
 */

import ExtractTextPlugin from 'extract-text-webpack-plugin';

const extractLess = new ExtractTextPlugin('[name].[contenthash].css');

module.exports = {
  /*
    Entry point for the bundle. First is a file containing initialisation
    code to allow setting the webpack bundle destination at runtime, then the
    entry point to the source code of the client bundle.
  */

  entry: {
    main: ['./src/public-path.js', './src/client.js']
  },

  /*
    Where the bundle should be output on the filesystem. A hash is included
    in the filename for cache busting.
  */

  output: {
    path: path.join(__dirname, '../', webpackDevServerConfig.customOptions.fullPath),
    filename: '[name].[hash].js',
  },

  /*
    Node polyfills applied to make some node modules work in a browser
    environment.
   */

  node: {
    net: 'empty',
    dns: 'empty'
  },

  /*
    Rules for how to process files of different types using webpack loaders
   */

  module: {
    rules: [
      /*
        Run all JavaScript files through eslint (for linting) and then babel
        (for transpiling from ES6/ES7 to ES5)
       */

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [ 'babel-loader', 'eslint-loader' ]
      },

      /*
        Pass all non-global LESS files through a postcss loader to convert to CSS
        and then add things like auto-prefixing (see postcss.config.js for
        details) then through a CSS loader to export a JavaScript object of class
        names (so you can use them in your JSX). See CSS modules for more details:
        https://github.com/css-modules/css-modules

        All references to less files are then are collected by the Extract Text
        plugin and placed in a separate file so the styling can be loaded in
        parallel with the JavaScript bundle in the browser.
       */

      {
        test: /^((?!\.global).)*\.less$/,
        use: extractLess.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                less: true,
                indentedSyntax: true,
                outputStyle: 'expanded',
                browsers: 'last 2 version'
              }
            }
          ]
        })
      },

      /*
        Similar to the handling of LESS files inside the components directory
        above, however LESS files outside the components directory are not
        parsed as CSS modules. The references are still extracted to a separate
        file by Extract Text plugin.
       */

      {
        test: /\.global\.less$/,
        use: extractLess.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                less: true,
                indentedSyntax: true,
                outputStyle: 'expanded',
                browsers: 'last 2 version'
              }
            }
          ]
        })
      },

      /*
        Asset files are passed through the url loader so files under 10kB are
        exported as data urls to reduce the number of separate requests that
        need to be made to load the bundle in a browser. Those greater than
        10kB are kept as separate files and exported as references to the file.
       */

      {
        test: /\.(png|jpg|jpeg|gif|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      },

      /*
        SVGs are treated similarly to all other asset files, but require a
        separate loader.
       */

      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
        options: {
          limit: 10000
        }
      },

      /*
        These file types are always exported as references to separate files,
        no matter their size.
       */

      {
        test: /\.(eot|ttf|wav|mp3|ico)$/,
        use: 'file-loader'
      }

    ]
  },

  plugins: [
    /*
      Define a environment variable NODE_ENV to be 'production', so all
      references in the compiled code will get this value. It saves having
      to run the script with an environment variable each time, instead
      allowing the value to be set at compile time.
     */

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "'production'"
      }
    }),

    /*
      Include the extract plugin so it is called by webpack
     */

    extractLess,

    /*
      When the bundle has been built, create a file, assets.js, that exports
      an object with all the file names of the bundle outputs so they can be
      referenced correctly by the node server and injected into the HTML it
      sends in response to requests
     */

    new AssetsPlugin({
      path: path.join(__dirname, '../build'),
      filename: 'assets.js',
      processOutput: x => `module.exports = ${JSON.stringify(x)};`
    }),

    /*
      Clear the build directory before output the bundle to ensure no older files
       are left.
     */

    new CleanWebpackPlugin(['build'], {
      root: path.join(__dirname, '../'),
      verbose: true
    }),

    /*
      Plugin to also create compressed versions of the output files for those
      browsers that support them.
     */

    new CompressionPlugin({
      test: /\.js$/,
      minRatio: 0.8
    }),

    /*
      Plugin to passe options to webpack that enables minimisation mode.
     */

    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),

    /*
      Compress or uglify the bundle's JavaScript code, to reduce filesize
     */

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      }
    }),

    /*
      Aggressively merge chunks
     */

    new webpack.optimize.AggressiveMergingPlugin()
  ]
};
