/*
  Redux utility for combining reducer functions into a single reducer layer.
  Allows allocating responsibility for updating parts of the stores content
  to particular functions
 */

import { combineReducers } from 'redux';

/*
  A reducer for updating and storing the current route in the store
 */

import { routerReducer } from 'react-router-redux';

import ButtonReducer from './ButtonReducer';

export default combineReducers({
  button: ButtonReducer,

  routing: routerReducer
});
