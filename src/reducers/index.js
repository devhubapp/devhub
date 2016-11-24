import { combineReducers } from 'redux';
import { NavigationReducer } from '@exponent/ex-navigation';

import config from './config';
import feed from './feed';

export default combineReducers({
  feed,
  config,
  navigation: NavigationReducer,
});
