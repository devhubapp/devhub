// @flow

import { combineReducers } from 'redux';

import { LOAD_FEED_SUCCESS } from '../utils/constants/actions';
import type { Action } from '../utils/types';
import type { GithubEvent } from '../utils/types/github';

// static data
import allEventsData from '../../test/data/github-bigquery.json';
import repoEventsData from '../../test/data/github-repo-events.json';
import userEventsData from '../../test/data/github-user-events.json';
import userReceivedEventsData from '../../test/data/github-user-received_events.json';

const data = [
  { id: 0, title: 'all', data: allEventsData },
  { id: 1, title: 'react', data: repoEventsData },
  { id: 2, title: 'sibelius', data: userReceivedEventsData },
  { id: 3, title: 'brunolemos', data: userEventsData },
];

export default (state:Array<GithubEvent> = data, { type, payload }: Action<Array<GithubEvent>>): Array<GithubEvent> => {
  switch (type) {
    case LOAD_FEED_SUCCESS: return [
      ...payload,
      ...state,
    ];
    default: return state;
  }
};
