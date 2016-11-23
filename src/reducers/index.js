import { combineReducers } from 'redux';
import { NavigationReducer } from '@exponent/ex-navigation';

import config from './config';

export default combineReducers({
  navigation: NavigationReducer,
  config,
});
