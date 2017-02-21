/*
  Configuration file for postcss loader - a webpack loader for postprocessing
  CSS using plugins: https://github.com/postcss/postcss#plugins
 */

module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};
