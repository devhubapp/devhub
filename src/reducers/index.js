import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import app from './app';
import auth from './auth';
import config from './config';
import entities from './entities';
import seenEvents from './seen-events';
import starredRepos from './starred-repos';

import { CLEAR_APP_DATA } from '../utils/constants/actions';
import type { Action } from '../utils/types';

const reducer = combineReducers({
  app,
  auth,
  config,
  entities,
  seenEvents,
  starredRepos,
});

const initialState = Map();

const indexReducer = (state: Object = initialState, action) => {
  const { type } = action || {};

  switch (type) {
    case CLEAR_APP_DATA:
      return initialState;

    default:
      return state;
  }
};

export default (state: Object = initialState, action: Action<Object>) => {
  const stateAfterIndexReducer = indexReducer(state, action);
  return reducer(stateAfterIndexReducer, action);
};
