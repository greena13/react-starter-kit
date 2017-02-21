/*
 Webpack itself. It exports plugins that are needed for the configuration file.
 */

import webpack from 'webpack';

/*
  Configuration file for webpack dev server
 */

import webpackDevServerConfig from './webpackDevServer.development.babel';

/*
  Utility for working with file paths. Useful for when an absolute path is required
 */

import path from 'path';

/*
  Webpack plugin that creates a JavaScript file that exports the bundle outputs'
  filenames (which contain cache-busting hashes that depend on the bundle
  contents, so cannot be known in advance.) This json file is then used by the
  node server bundle to resolve the correct file paths to the client bundle.
 */

import AssetsPlugin from 'assets-webpack-plugin';

module.exports = {

  /*
    Entry point for the bundle. First include the runtime environment that will
    regularly check for code updates and apply them from the webpack dev server,
    then include a file containing initialisation code to allow setting the
    webpack bundle destination at runtime in a way that works for both the node
    server and the client bundle and
   */

  entry: {
    main: [
      'webpack-dev-server/client?' + webpackDevServerConfig.customOptions.host,
      'webpack/hot/dev-server',
      './src/public-path.js',
      './src/client.js'
    ],
  },

  /*
    Where the bundle should be output on the filesystem. As bundle is served from memory
    in development, you will not actually find the file at the specified location on
    your file system.

    No hash is included in the filename to reduce complexity in the development
    environment.
   */

  output: {
    path: path.join(__dirname, '../', webpackDevServerConfig.customOptions.fullPath),
    filename: '[name].js'
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
    The development tool to help with debugging. eval executes each module with eval
    and outputs source maps to ensure the line numbers that appear in stack traces
    correspond to your source code and not the bundled code.
   */

  devtool: 'eval',


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
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: false
            }
          }
        ]
      },

      /*
        Pass all non-global LESS files through a postcss loader to convert to CSS
        and then add things like auto-prefixing (see postcss.config.js for
        details) then through a CSS loader to export a JavaScript object of class
        names (so you can use them in your JSX). See CSS modules for more details:
        https://github.com/css-modules/css-modules

        Then finally pass through a style loader, which adds CSS to the DOM by
        injecting <style> tags.
       */

      {
        test: /^((?!\.global).)*\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
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
            loader: 'style-loader'
          },
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
        loader: 'file-loader'
      }
    ]
  },

  /*
    Plugins that augment how webpack behaves (and not just how particular
    files should be processed - for that, see the module rules above).
   */

  plugins: [

    /*
      Define a environment variable NODE_ENV to be 'development', so all
      references in the compiled code will get this value. It saves having
      to run the script with an environment variable each time, instead
      allowing the value to be set at compile time.
     */

    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: "'development'"
      }
    }),

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
      Include the hot module replacement runtime code in the bundle, which
      is necessary for periodically checking with the webpack dev server
      to see if there are any new versions of the code available to apply.
      It also handles applying those updates when detected.
     */
    new webpack.HotModuleReplacementPlugin()
  ]
};
