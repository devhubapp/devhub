// @flow

import { put, takeEvery } from 'redux-saga';

import {
  LOAD_FEED_REQUEST,
} from '../utils/constants/actions';

import { loadFeedRequest } from '../actions';

export function* loadFeed(): Generator<*, *, *> {
  yield put(loadFeedRequest())
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchLoadFeed(): Generator<*, *, *> {
  yield takeEvery(LOAD_FEED_REQUEST, loadFeed)
}

export default function* (): Generator<*, *, *> {
  return yield [
    watchLoadFeed
  ];
}
