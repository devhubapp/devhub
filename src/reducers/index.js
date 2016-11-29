import { combineReducers } from 'redux';
import { NavigationReducer as navigation } from '@exponent/ex-navigation';

import config from './config';
import entities from './entities';

export default combineReducers({
  config,
  entities,
  navigation,
});
