// @flow

import moment from 'moment';
import { normalize } from 'normalizr';
import { delay } from 'redux-saga';
import { call, fork, put, race, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { dateToHeaderFormat, enhanceNotificationsData } from '../utils/helpers';
import { NotificationSchema } from '../utils/normalizr/schemas';
import { accessTokenSelector, isLoggedSelector, notificationIdsSelector } from '../selectors';

import { LOAD_NOTIFICATIONS_REQUEST, UPDATE_NOTIFICATIONS } from '../utils/constants/actions';

import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadNotificationsRequest,
  loadNotificationsSuccess,
  loadNotificationsFailure,
  updateNotifications,
} from '../actions';

import { authenticate, getApiMethod } from '../api/github';

const sagaActionChunk = { dispatchedBySaga: true };

function* onLoadNotificationsRequest({ payload }: Action<ApiRequestPayload>) {
  const state = yield select();
  const accessToken = accessTokenSelector(state);
  if (!accessToken) return;

  yield call(authenticate, accessToken);

  // just to have the token on success/failure actions
  const requestPayload = { ...payload, accessToken };

  try {
    const { params, requestType } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 10000),
    });

    if (timeout) throw new Error('Timeout', 'TimeoutError');

    // console.log('onLoadNotificationsRequest response', response);
    const { data, meta }: ApiResponsePayload = response;

    let finalData = data;

    if (data) {
      const enhancedData = enhanceNotificationsData(data);

      // console.log('enhancedData', enhancedData);
      finalData = normalize(enhancedData, [NotificationSchema]);
      // console.log('enhancedData normalized', finalData);
    }

    yield put(loadNotificationsSuccess(requestPayload, finalData, meta, sagaActionChunk));
  } catch (e) {
    console.log('onLoadNotificationsRequest catch', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loadNotificationsFailure(requestPayload, errorMessage, sagaActionChunk));
  }
}

function* onUpdateNotificationsRequest() {
  // const state = yield select();
  // const notificationIds = notificationIdsSelector(state);
  // const isEmpty = notificationIds.size <= 0;

  // const lastModifiedAt = new Date(state.getIn(['notifications', 'lastModifiedAt']));
  // const defaultModifiedSince = moment().subtract(1, 'month').toDate().toString();
  const defaultSince = moment().subtract(1, 'month').format();

  const params = { all: true, since: defaultSince };

  params.headers = {};
  params.headers['If-Modified-Since'] = dateToHeaderFormat(defaultSince);
  // if (!isEmpty && lastModifiedAt) {
    // params.headers['If-Modified-Since'] = dateToHeaderFormat(lastModifiedAt);
  // }

  yield put(loadNotificationsRequest(params, sagaActionChunk));
}

// update user notifications each minute
function* startTimer() {
  yield take(REHYDRATE);

  while (true) {
    const state = yield select();
    const isLogged = isLoggedSelector(state);

    if (isLogged) {
      yield put(updateNotifications(sagaActionChunk));
      yield call(delay, 60 * 1000);
    } else {
      yield call(delay, 1000);
    }
  }
}

export default function* () {
  return yield [
    yield takeLatest(UPDATE_NOTIFICATIONS, onUpdateNotificationsRequest),
    yield takeEvery(LOAD_NOTIFICATIONS_REQUEST, onLoadNotificationsRequest),
    yield fork(startTimer),
  ];
}
