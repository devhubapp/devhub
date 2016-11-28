import { combineReducers } from 'redux';
import { NavigationReducer } from '@exponent/ex-navigation';

import config from './config';
import entities from './entities';
import feed from './feed';

export default combineReducers({
  config,
  entities,
  feed,
  navigation: NavigationReducer,
});
