/*
 Webpack itself. It exports plugins that are needed for the configuration file.
 */

import webpack from 'webpack';

/*
 Utility for working with file paths. Useful for when an absolute path is required
 */

import path from 'path';

/*
 Webpack plugin for copy files to the output directory that are not included in
 the bundle itself. This is mainly used for copying pug templates to the output
 directory so the may be deployed with the node server, but don't form part of the
 source code for the bundle.
 */

import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = {
  /*
    Entry point for the bundle. First is a file containing initialisation code
    to allow setting the webpack bundle destination at runtime in a way that
    works for both the node server and the client bundle and then the entry
    point for the node server.
   */

  entry: [
    './src/public-path.js',
    './src/server.js'
  ],

  /*
    Place the server bundle in the build directory under scripts with the
    name of server.js and using an export format that will allow it to be
    imported using commonjs2
   */

  output: {
    path: path.join(__dirname, '../build/scripts'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },

  /*
    Build the node server bundle to be executed in a node environment and not the
    browser
   */

  target: 'node',

  /*
    Don't try and find assets.js file during compilation. It will only be there
    at runtime, once the client bundle has output it.

    Prevent bundling any modules (anything that does not resemble a relative
    path) and instead expect them to be available at runtime.
   */

  externals: [
    /^\.\.\/assets$/,

    function filter(context, request, callback) {
      const isExternal = request.match(/^[@a-z][a-z\/\.\-0-9]*$/i);
      callback(null, Boolean(isExternal));
    }
  ],

  /*
    Do not mock any of the node utilities as the bundle will be running in
    a node environment
   */

  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },

  /*
    Rules for how to process files of different types using webpack loaders
   */

  module: {
    /*
      Prevent parsing any minified JavaScript files
     */

    noParse: /\.min\.js/,

    rules: [
      /*
        Run all JavaScript files through babel (for transpiling from ES6/ES7 to ES5)
       */

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      /*
       Pass all non-global LESS files through a postcss loader to convert to CSS
       and then add things like auto-prefixing (see postcss.config.js for
       details) then through a CSS loader to export a JavaScript object of class
       names (so you can use them in your JSX). See CSS modules for more details:
       https://github.com/css-modules/css-modules
       */

      {
        test: /^((?!\.global).)*\.less$/,
        use: [
          {
            loader: 'css-loader/locals',
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
      },

      /*
        Similar to the handling of LESS files inside the components directory
        above, however LESS files outside the components directory are not
        parsed as CSS modules.
       */

      {
        test: /\.global\.less$/,
        use: [
          {
            loader: 'css-loader/locals'
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
      },

      /*
        Import txt files as strings
       */

      {
        test: /\.txt$/,
        use: 'raw-loader'
      },

      /*
        Asset files are passed through the url loader so files under 10kB are
        exported as data urls to reduce the number of separate requests that
        need to be made to load the bundle in a browser. Those greater than
        10kB are kept as separate files but are not emitted, as they are
        already available in the client bundle.
       */

      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          emitFile: false,
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
      Define environment variable NODE_ENV to be 'production' so all references in
      the compiled code will get these values. The environment variables to set
      the port for the node server to mount to and the path to the client bundle
      must be defined when starting the node server, allowing the same bundle to
      be used with different environments and settings
     */

    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'production'"
    }),

    /*
      Copy all the pug templates stored in the views directory across to the
      build directory so they are available when the node server is run. Also
      copy the package.json file so the node modules can be installed on your
      production server to allow running the node server
     */

    new CopyWebpackPlugin([
      { from: 'package.json', to: '../package.json' },
      { from: 'src/views', to: 'views' }
    ])
  ]
};
