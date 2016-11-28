// @flow

import { arrayOf, normalize } from 'normalizr';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { EventSchema } from '../api/normalizr/schemas';
import { LOAD_USER_FEED_REQUEST } from '../utils/constants/actions';

import {
  loadUserFeedSuccess,
  loadUserFeedFailure,
} from '../actions';

import github from '../api/github';

export function* loadUserFeed({ payload: { username } = {} }: Object): Generator<*, *, *> {
  try {
    const { data, meta } = yield call(github.activity.getEventsReceived, { username });
    const normalizedData = normalize(data, arrayOf(EventSchema));
    yield put(loadUserFeedSuccess(username, normalizedData, meta))
  } catch (error) {
    yield put(loadUserFeedFailure(error))
  }
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchloadUserFeed(): Generator<*, *, *> {
  yield takeEvery(LOAD_USER_FEED_REQUEST, loadUserFeed)
}

export default function* (): Generator<*, *, *> {
  return yield [
    watchloadUserFeed()
  ];
}
