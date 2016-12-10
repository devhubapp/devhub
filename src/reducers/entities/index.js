// @flow

import { fromJS, Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import columns from './columns';
import comments from './comments';
import events from './events';
import issues from './issues';
import orgs from './orgs';
import pullRequests from './pull-requests';
import repos from './repos';
import subscriptions from './subscriptions';
import users from './users';
import { CLEAR_APP_DATA, LOAD_SUBSCRIPTION_DATA_SUCCESS } from '../../utils/constants/actions';
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

const initialState = Map();

const indexReducer = (state: Object = initialState, action) => {
  const { type, payload } = action || {};

  switch (type) {
    case CLEAR_APP_DATA:
      return initialState;

    case LOAD_SUBSCRIPTION_DATA_SUCCESS:
      return ((_payload) => {
        const { data: { entities } = {} } = _payload || {};
        return state.mergeDeep(fromJS(entities));
      })(payload);

    default:
      return state;
  }
};

export default (state: Object = initialState, action: Action<Object>) => {
  const stateAfterIndexReducer = indexReducer(state, action);
  return reducer(stateAfterIndexReducer, action);
};
