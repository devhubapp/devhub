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
import users from './users';
import { LOAD_USER_FEED_SUCCESS } from '../../utils/constants/actions';
import type { Action } from '../../utils/types';

const reducer = combineReducers({
  columns,
  comments,
  events,
  issues,
  orgs,
  pullRequests,
  repos,
  users,
});

export default (state: Object = {}, action: Action<Object>) => {
  let _state = ((state, action) => {
    const { type, payload: { data: { entities } = {} } = {} } = action || {};

    switch (type) {
      case LOAD_USER_FEED_SUCCESS: return merge({}, state, entities);
      default: return state;
    }
  })(state, action);

  return reducer(_state, action);
};
