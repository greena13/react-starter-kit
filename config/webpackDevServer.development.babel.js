/*
  Configuration file for the client bundle in development.

  These details are NOT where you should navigate your browser to (you should
  navigate to where the node server is mounted), but the address that the HTML
  rendered by the node server points to, to download the assets and receive hot
  updates from.
 */

// Path to serve all requests relative to

const contentBase = './build/public/';

// Path to output bundle to

const path = 'assets/';

// Complete file path where client bundle will be output to

const fullPath = `${contentBase}/${path}`;

// The port to mount the webpack dev server on

const port = 8081;

// Complete url that client bundle will be hosted on

const host = `http://localhost:${port}/`;
const fullUrl = `${host}${path}`;

module.exports = {
  customOptions: {
    path, host, fullUrl, fullPath, port
  },

  /*
    Configuration options to be passed to webpack dev server
   */

  devServerOptions: {

    port,
    contentBase,

    // Enable hot loading updates to the client bundle

    hot: true,

    // Use the history API for routing

    historyApiFallback: true,

    // Display colors to the console when reporting build process and errors

    stats: {
      colors: true
    }
  }
};
