// @flow

import merge from 'lodash/merge';
import { combineReducers } from 'redux';

import columns from './columns';
import comments from './comments';
import events from './events';
import issues from './issues';
import orgs from './orgs';
import pullRequests from './pull-requests';
import repos from './repos';
import subscriptions from './subscriptions';
import users from './users';
import { LOAD_SUBSCRIPTION_DATA_SUCCESS } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

const reducer = combineReducers({
  columns,
  comments,
  events,
  issues,
  orgs,
  pullRequests,
  repos,
  subscriptions,
  users,
});

const indexReducer = (state, action) => {
  const { type, payload: { data: { entities } = {} } = {} } = action || {};

  switch (type) {
    case LOAD_SUBSCRIPTION_DATA_SUCCESS: return merge({}, state, entities);
    default: return state;
  }
};

export default (state: Object = {}, action: Action<Object>) => {
  const stateAfterIndexReducer = indexReducer(state, action);
  return reducer(stateAfterIndexReducer, action);
};
