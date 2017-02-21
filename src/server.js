/*
  Node server that forms the backbone of the http server, allowing various
  middlewares to customise and define its behaviour
 */

import koa from 'koa';

/*
  Rendering templates to create the HTML that will reference the client
  JavaScript bundle in order for the browser to download and execute
 */

import Pug from 'koa-pug';

/*
  Functional programming utility useful for enumeration and iteration
 */

import _ from 'lodash';

/*
  React itself and ReactDOM for rendering the client bundle to a string
  that can be injected into the pug templates. Forms the basis of server
  side rendering.
 */

import React from 'react';
import ReactDOM from 'react-dom/server';

/*
  Allows setting the title and other meta data about the page, on a page
  by page basis for bette search indexability
 */

import Helmet from 'react-helmet';

/*
  Asset.js file that exports the list of client bundle filenames so they
  may be correctly referenced in the pug templates and downloaded by
  the browser
 */

import assets from '../assets';

/*
  React router for matching the incoming HTTP request with what React js
  content should be rendered in response
 */

import { match, RouterContext } from 'react-router';

/*
  React Redux component responsible for placing a reference to the redux
  store on context so it can be used by all container components in the
  render tree to get the data that they need
 */

import { Provider }  from 'react-redux';

/*
  Loads the redux store and configuration appropriate for the nominated
  environment
 */

import configureStore from './store';

/*
  HTTP status codes for matching against data request response status codes
 */

import { NOT_FOUND, GONE } from './constants/HttpStatusCodes';

import { API_ERROR } from './constants/ErrorTypes';

/*
  Contains the list of routes for the application that React Router will
  use to match incoming requests to component trees
 */

import ApplicationRoutes from './routes/ApplicationRoutes';

/*
  A file containing color constants used for styling the button
 */

import ButtonColors from './constants/ButtonColors';

try {
  /*
    Create and configure the instance of the http server to be used
   */

  const server = koa();
  const port = process.env.SERVER_PORT;

  /*
    Create instance of rendering engine, nominate where the view templates
    are located and the server instance that will be using it. It handles
    registering itself as middleware automatically
   */

  new Pug({
    viewPath: __dirname + '/views',
    app: server
  });

  /*
    Define the function that will serve as the middleware responsible for
    rendering responses to incoming HTTP requests
   */

  let routes = ApplicationRoutes;

  server.use(function *() {
    try {
      yield ((callback) => {
        const location = this.url;

        /*
          Pass the current request url and list of application routes to React
          Router's match function so it can establish what to render in response
         */

        match({ routes, location }, (error, redirectLocation, renderProps) => {

          if (error) {

            /*
              If an error has occurred while trying to match the location url to
              the application routes, pass it back up to the koa middleware. This
              indicates something has done wrong and will be handled by the catch
              clause of the surrounding try block. It does not indicate a
              corresponding route could not be found.
            */

            callback(error);

          } else if (redirectLocation) {

            /*
              If the location matches one that should be redirected according to
              the application routes, tell koa to send a redirect response back
              to the browser
             */

            const redirectUrl = redirectLocation.pathname + redirectLocation.search;
            this.redirect(redirectUrl, '/');

            callback(null);

          } else if (renderProps) {

            /*
              If the request matches a route in application routes, handle rendering
              the corresponding react component tree, with the correct data
             */

            const { components, params, location } = renderProps;

            /*
              Create a clean Redux store with the correct default state so each
              request made to the server is independent of those that have come
              before it
             */

            const initialState = { button: { color: ButtonColors.BLUE }};
            const store = configureStore(initialState);

            /*
              Create the object that will contain properties of the response,
              setting the correct default values. This object can be used by
              the data retrieval layer to set response codes based on what happens
              when attempting to fetch data from your API server
             */

            const responseOptions = {
              status: 200
            };

            /*
              Create the options object containing all the information the data
              retrieval layer needs to correctly fetch and store the data needed
              to satisfy the request and customise the response
             */

            const options = {
              /*
                The store that the data, once retrieved, will be deposited into
               */

              store,

              /*
                The url params React Router's match has extracted from the url
                associated with the request and the query, so they may be used to
                filter what data should be retrieved.
               */

              params,
              query: location.query,

              /*
                The cookie sent with the request so that it may be perpetuated to
                any data APIs for authentication and session-dependent data
               */

              cookie: this.headers['cookie'],

              /*
                The ip address of the original request so that it may be perpetuated
                to any data APIs for location-dependent data
               */

              ip_address: this.ip,

              /*
                Options that describe the response that will be sent back to the client
                containing the requested HTML and data. Useful for setting status
                codes if there is a problem fetching the data upstream
               */

              responseOptions
            };

            retrieveData(components, options).then(() => {

              /*
                Once the data has been retrieved (and all the data fetch promises
                have resolved) then render the React application, using the store
                populated with the data, the props extracted from the url and the
                response options
               */

              renderApplication(this, { store, renderProps, responseOptions });

              callback(null);

            }).catch((error) => {

              /*
                If an error is thrown while trying to fetch data, abort trying to
                retrieve the data and rendering a React component tree
               */

              const { name, status } = error;

              if (name === API_ERROR) {

                /*
                  If the error is an API_ERROR, it has been thrown by the data
                  persistence layer to indicate some error status code was detected
                  on an external API and the rest of the React application rendering
                  and data fetching should abort, so a static error page can be
                  rendered instead.
                 */

                if ( _.includes([NOT_FOUND, GONE], status) ) {
                  respondWithStaticNotFoundPage(this, { status, callback });
                } else {
                  respondWithStaticErrorPage(this, { status });
                }

                callback(null);

              } else {

                /*
                  If the error is not an API_ERROR, than an error has been thrown
                  while executing the data retrieval code. It should be passed back
                  up to the koa middleware chain and likely handled by the catch
                  clause of the outer try block.
                 */

                callback(error);
              }
            })

          } else {

            /*
              When no application routes match the requested url, render a
              static not found page rather than attempting to render a
              React component tree.
             */

            respondWithStaticNotFoundPage(this, { status: 404 });

            callback(null);
          }
        });
      });

    } catch(error) {

      /*
        Handle all unhandled errors that have occurred either by being thrown
        or passed to callback while trying to render a response to the request.
        Render a static error page, instead.
       */

      respondWithStaticErrorPage(this, { status: 500 });

      this.app.emit('error', error, this);
    }
  });

  server.listen(port, renderServerReadyMessage);

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      console.log('[HMR] Waiting for server-side updates');

      module.hot.accept('./routes/ApplicationRoutes', () => {
        routes = require("./routes/ApplicationRoutes");
      });

      module.hot.addStatusHandler((status) => {
        if (status === "abort") {
          setTimeout(() => process.exit(0), 0);
        }
      });
    }
  }

} catch (error) {

  /*
    Log an errors that occur with mounting the koa server to the console
   */

  console.error(error.stack || error);
  throw error;
}

function retrieveData(components, { store, params, query, cookie, ip_address, responseOptions }) {
  /*
    Find all of the components in the render tree that have defined
    a fetchData method. These are the ones that have declared they
    have a data dependency and are able to handle retrieving it
   */

  const dependentComponents = _.filter(components, (component) => {
    return component && component.fetchData
  });

  /*
    Pass a reference to the store's dispatch method, the url and query
    parameters, and other request information to the fetchData method
    of each component. Each fetchData method is expected to return a
    promise that resolves once the data has been retrieved and deposited
    into the store.
   */

  const dependencyRequests = _.map(dependentComponents, ({ fetchData }) => {
    return fetchData(store.dispatch, { ...params, ...query }, { cookie, ip_address, responseOptions });
  });

  /*
    Collect all the fetchData promises into a single promise that resolves
    once all the data is available
   */

  return Promise.all(dependencyRequests);
}

function renderApplication(context, { store, renderProps, responseOptions }) {
  /*
   Set that status of the response based on the responseOptions
   */

  context.status = responseOptions.status;

  /*
   Render the React component tree to a string so that it may be injected
   into a pug template and delivered as a HTML page.

   The Helmet references in the component tree will record what the correct
   page title and metadata should be in Helmet itself.
   */

  let htmlContent = ReactDOM.renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps} />
    </Provider>
  );

  /*
   Reset Helmet back to its original state, saving the current page title and
   metadata in the head variable. This prevents the information from this
   request bleeding into the next one.
   */

  let head = Helmet.rewind();

  /*
   Pass the title and metadata, stringified component tree, contents of the
   store and other information that is not request-specific to the index pug
   template so it can be injected into the HTML of the response
   */

  context.render('index', htmlTemplateVariables(
    head,
    htmlContent,
    store.getState()
  ), true);
}

function htmlTemplateVariables(head = {}, htmlContent = '', initialState = {}) {
  /*
    Construct the complete configuration object for the view template, combining
    both information that remains constant between requests and request-specific
    information.
   */

  return {
    /*
      Object containing the title and metadata information to be injected into
      the <head> tag of the template's output
     */
    head,

    /*
      The string of HTML to be injected into the body of the template output
     */

    htmlContent,

    /*
      The serialised contents of the store to be placed on window in a JavaScript
      block inside the head of the template,
     */

    initialState: JSON.stringify(initialState),

    /*
      The path to the client bundle, to be prepended to the <script> tags injected
      into the template's <head> tag
     */

    assetsUrl: process.env.ASSETS_PATH,

    /*
      The list of client bundle filenames, to be appended to the assetsUrl above
     */

    assets: assets,

    /*
      Boolean to indicate whether server is running in production mode or not so
      the template can selectively include segments based on the environment
     */

    productionBuild: process.env.NODE_ENV === "production"
  };
}

function respondWithStaticNotFoundPage(context, { status }) {
  /*
    Set that status of the response and render the notFound pug template
   */

  context.status = status;
  context.render('notFound');
}

function respondWithStaticErrorPage(context, { status }) {
  /*
   Set that status of the response and render the error pug template
   */

  context.status = status;
  context.render('error');
}

function renderServerReadyMessage(){
  /*
   Display the following message in the console when the server has mounted
   and is now listening for requests
   */

  console.info('');
  console.info('🖥   Node server mounted');
  console.info('-----------------------------------------------------------------------------------');
  console.info("Server READY and listening on:            http://localhost:%s/", process.env.SERVER_PORT);
  console.info("* This can be changed using the environment variable SERVER_PORT");
  console.info('');
  console.info("Using client bundle path                  %s", process.env.ASSETS_PATH);
  console.info("* This can be changed using the environment variable ASSETS_PATH");
  console.info('-----------------------------------------------------------------------------------');
  console.info('');
}
