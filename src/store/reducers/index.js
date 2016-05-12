'use strict';

import { combineReducers } from 'redux';

import ButtonReducer from './ButtonReducer';

export default combineReducers({
  button: ButtonReducer
});
