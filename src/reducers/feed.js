// @flow

import { combineReducers } from 'redux';

import { LOAD_USER_FEED_SUCCESS } from '../utils/constants/actions';
import type { Action, Column } from '../utils/types';

type LoadUserFeedPayload = { username: string, data: Object, meta: Object };
export default (state :Array<Column> = [], action: Action<LoadUserFeedPayload>): Array<Column> => {
  const { type, payload: { username, data } = {} } = action || {};

  switch (type) {
    case LOAD_USER_FEED_SUCCESS: return [
      {
        id: '0',
        title: username,
        data: (data || {}).result,
      },
    ];
    default: return state;
  }
};
