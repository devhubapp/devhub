// @flow

import merge from 'lodash/merge';

import type { Action } from '../utils/types';

const initialState = {
  comments: {},
  events: {},
  issues: {},
  orgs: {},
  pullRequests: {},
  repos: {},
  users: {},
};

export default (state: Object = initialState, action: Action<Object>) => {
  const { payload: { data: { entities } = {} } = {} } = action || {};

  if (entities) {
    return merge({}, state, entities);
  }

  return state;
};
