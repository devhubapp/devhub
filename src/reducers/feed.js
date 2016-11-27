// @flow

import { combineReducers } from 'redux';

import { LOAD_USER_FEED_SUCCESS } from '../utils/constants/actions';
import type { Action } from '../utils/types';
import type { GithubEvent } from '../utils/types/github';

// // static data
// import allEventsData from '../../test/data/github-bigquery.json';
// import repoEventsData from '../../test/data/github-repo-events.json';
// import userEventsData from '../../test/data/github-user-events.json';
// import userReceivedEventsData from '../../test/data/github-user-received_events.json';
//
// const data = [
//   { id: 0, title: 'all', data: allEventsData },
//   { id: 1, title: 'react', data: repoEventsData },
//   { id: 2, title: 'sibelius', data: userReceivedEventsData },
//   { id: 3, title: 'brunolemos', data: userEventsData },
// ];

type Column = { id: string, title: string, data: Array<GithubEvent>, meta: Object };
type LoadUserFeedPayload = { username: string, data: Array<GithubEvent> };
export default (state :Array<Column> = [], action: Action<LoadUserFeedPayload>): Array<Column> => {
  const { type, payload: { username, data } = {} } = action || {};

  switch (type) {
    case LOAD_USER_FEED_SUCCESS: return [{
      id: '0',
      title: username,
      data,
    }];
    default: return state;
  }
};
