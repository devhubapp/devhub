// @flow

import { LOAD_FEED } from '../utils/constants/actions';
import type { Action } from '../utils/types';

// dummy data
import repoEventsData from '../../test/data/github-repo-events.json';
import userEventsData from '../../test/data/github-user-events.json';
import userReceivedEventsData from '../../test/data/github-user-received_events.json';

const isStarEvent = ({ type }) => type === 'WatchEvent';

const data = [
  { id: 0, title: 'react', data: repoEventsData.filter(item => !isStarEvent(item)) },
  { id: 1, title: 'sibelius', data: userReceivedEventsData },
  { id: 2, title: 'brunolemos', data: userEventsData },
];

export default (state:Array = data, { type, payload }: Action<Array>): Array => {
  switch (type) {
    case LOAD_FEED: return [
      ...payload,
      ...state,
    ];
    default: return state;
  }
};
