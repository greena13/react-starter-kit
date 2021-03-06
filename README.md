# React Starter Kit v2.0

Cloneable React starter project that includes development tools and production optimisations.


## Disclaimer 

This may not be the optimal starting point for your project. It includes a lot of different libraries and tools that cover many concerns - some of which you may wish to tackle differently. There are many React starter kits and templates available; make sure you choose the one that best suits your needs (the list of inspirations below may be a good place to start).
  
  
## Upgrading from an earlier version


Version 2.0 of `react-starter-kit` has undergone some significant changes, including upgrading all dependencies and moving to Webpack 2.0.

## Getting Started

Clone this repo to your local machine

    git clone https://github.com/greena13/react-starter-kit.git
        

Install the node modues
      
    npm install
      

Run the development script

    npm run watch
    
    
Navigate your browser to `http://localhost:8080`

## Generating the production build

    npm run build
    

## Testing the production build on your local machine

Start the server, specifying the port to mount to, and the url that the assets will be hosted on: 

    SERVER_PORT=8080 ASSETS_PATH='http://localhost:8081/assets/' node build/scripts/server.js
     
Use a simple http server like `http-server` to serve the build directory (on the url specified using ASSETS_PATH)
  
    http-server ./build/public -p 8081
    
Navigate your browser to the port specified above (using the `SERVER_PORT` environment variable).
    
## Architecture
 
**Navigation \& Routing:** [React Router](https://github.com/reactjs/react-router)

**Data manipulation \& events handling:** [Redux](https://github.com/reactjs/redux)

**CSS:** Global CSS files and [CSS modules](https://github.com/css-modules/css-modules)

**XHR:** [Isomorphic fetch](https://github.com/github/fetch)

**Populating html & head tags:** [React Helmet](https://github.com/nfl/react-helmet)

**Server-side rendering:** [Koa server](http://koajs.com/), with [Pug (Jade)](https://github.com/pugjs/pug) templates

## Development Tools:
 
**ES6 Syntax & Polyfills:** [Babel.js](https://babeljs.io/)

**Bundling:** [Webpack](https://webpack.github.io/docs/)

**Hot Reloading:** [Webpack development server](https://webpack.github.io/docs/webpack-dev-server.html)

**Code linting:** [ESLint](https://github.com/MoOx/eslint-loader)

**Data Visualisation:** Redux Devtools that can be opened in your browser using `ctrl+shift+x` and moved around using `ctrl+shift+z`.

## Production optimisation:
 
**CSS Extraction:** Styling is extracted into a separate file in production to enable downloading them in parallel with the JavaScript application.

**Compression:** [Assets are gzipped](https://github.com/webpack/compression-webpack-plugin) to allow for faster transmission to browsers that support it.

**Minification (uglification):** JavaScript files are minified to reduce file size in production.

**Cache busting :** Filenames include a hash to prevent repeat-visitors using outdated versions of assets.


## Configuration Structure

Separate webpack configuration files for the client application and the koa server for development and production, totalling 4 separate files.

## Inspirations

### Starter Kits

- [RickWong/react-isomorphic-startkit](https://github.com/RickWong/react-isomorphic-starterkit)
- [React Starter Kit](https://www.reactstarterkit.com/)

### Resources

- [Pro React - Webpack for React](http://www.pro-react.com/materials/appendixA/)
- [Survivejs.com - Webpack](http://survivejs.com/webpack/introduction/)



