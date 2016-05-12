'use strict';

import { createStore, applyMiddleware } from 'redux';
import Thunk from 'redux-thunk';
import RootReducer from './reducers';

function configureStore(initialState){
  return createStore(RootReducer, initialState, applyMiddleware(Thunk));
}

module.exports = configureStore;
