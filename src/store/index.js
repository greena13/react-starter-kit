/*
  Loads the correct configuration for the development and production builds
  of the client and server, based on the environment variable NODE_ENV,
  set in the webpack configuration file
 */

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./config.development');
} else {
  module.exports = require('./config.production');
}
