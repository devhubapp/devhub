// @flow

import { arrayOf, normalize } from 'normalizr';
import { takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';

import { EventSchema } from '../utils/normalizr/schemas';
import { LOAD_USER_FEED_REQUEST } from '../utils/constants/actions';
import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadUserFeedSuccess,
  loadUserFeedFailure,
} from '../actions';

import github from '../api/github';

export function* loadUserFeed({ payload }: Action<ApiRequestPayload>): Generator<*, *, *> {
  try {
    const { username } = payload.params;

    const { data, meta }: ApiResponsePayload = (
      yield call(github.activity.getEventsReceived, { username })
    );

    const normalizedData = normalize(data, arrayOf(EventSchema));

    yield put(loadUserFeedSuccess(payload, normalizedData, meta))
  } catch (error) {
    yield put(loadUserFeedFailure(payload, error))
  }
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchloadUserFeed(): Generator<*, *, *> {
  yield takeEvery(LOAD_USER_FEED_REQUEST, loadUserFeed)
}

export default function*(): Generator<*, *, *> {
  return yield [
    watchloadUserFeed()
  ];
}
