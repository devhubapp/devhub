import { combineReducers } from 'redux';
import { NavigationReducer as navigation } from '@exponent/ex-navigation';

import app from './app';
import config from './config';
import entities from './entities';

export default combineReducers({
  app,
  config,
  entities,
  navigation,
});
