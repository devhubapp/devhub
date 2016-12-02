import { combineReducers } from 'redux-immutable';

import app from './app';
import config from './config';
import entities from './entities';

export default combineReducers({
  app,
  config,
  entities,
});
