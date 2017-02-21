/*
 Redux utilities for creating and configuring the store
 */

import { createStore, applyMiddleware } from 'redux';

/*
 Redux middleware that allows handling asynchronous calls
 */

import Thunk from 'redux-thunk';

/*
 File that contains index of what reducers should be given responsibility
 for maintaining each attribute of the store
 */

import RootReducer from './reducers';

/*
  Creates a minimal store for production, with none of the development tools
  included
 */

function configureStore(initialState){
  return createStore(RootReducer, initialState, applyMiddleware(Thunk));
}

module.exports = configureStore;
