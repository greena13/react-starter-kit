'use strict';

import { createStore, applyMiddleware, compose } from 'redux';
import Thunk from 'redux-thunk';

import { persistState } from 'redux-devtools';
import DevTools from '../components/DevTools';

import RootReducer from './reducers';

function enhancer(){
  if (typeof window !== 'undefined') {
    return compose(
      applyMiddleware(Thunk),
      DevTools.instrument(),
      persistState(getDebugSessionKey())
    );
  }  else {
    return compose(applyMiddleware(Thunk));
  }
}

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(RootReducer, initialState, enhancer());

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      store.replaceReducer(require('./reducers'));
    });
  }

  return store;
}

module.exports = configureStore;
