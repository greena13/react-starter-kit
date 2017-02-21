/*
  Redux utilities for creating and configuring the store
 */

import { createStore, applyMiddleware, compose } from 'redux';

/*
  Redux middleware that allows handling asynchronous calls
 */

import Thunk from 'redux-thunk';

/*
  Tools for visualising the contents of the redux store
 */

import { persistState } from 'redux-devtools';
import DevTools from '../components/DevTools';

/*
  File that contains index of what reducers should be given responsibility
  for maintaining each attribute of the store
 */

import RootReducer from './reducers';

function enhancer(){

  if (typeof window !== 'undefined') {

    /*
      When running as part of the client bundle, use the middleware that
      supports async data fetches, enable the redux devtools and enable
      persisting store contents when debugging
     */

    return compose(
      applyMiddleware(Thunk),
      DevTools.instrument(),
      persistState(getDebugSessionKey())
    );
  }  else {

    /*
      When running as part of the server, just use the async middleware
     */

    return compose(applyMiddleware(Thunk));
  }
}

function getDebugSessionKey() {
  /*
    Try and get the debug session key from the url
   */

  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

function configureStore(initialState) {
  /*
    Create and configure the store, initialising it with the passed state
   */

  const store = createStore(RootReducer, initialState, enhancer());

  /*
    Allow hot-swapping out the reducers during development
   */

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}

module.exports = configureStore;
