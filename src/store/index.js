'use strict';

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./config.development');
} else {
  module.exports = require('./config.production');
}
