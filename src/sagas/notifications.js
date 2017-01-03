// @flow

import moment from 'moment';
import { normalize } from 'normalizr';
import { delay } from 'redux-saga';
import { call, fork, put, race, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { dateToHeaderFormat } from '../utils/helpers';
import { NotificationSchema } from '../utils/normalizr/schemas';
import { accessTokenSelector, isLoggedSelector, lastModifiedAtSelector } from '../selectors';

import { LOAD_NOTIFICATIONS_REQUEST, UPDATE_NOTIFICATIONS, LOGIN_SUCCESS, LOGOUT } from '../utils/constants/actions';

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

  yield call(authenticate, accessToken);

  // just to have the token on success/failure actions
  const requestPayload = { ...payload, accessToken };

  try {
    if (!accessToken) {
      throw new Error('You must be logged in to see this', 'NotAuthorizedException');
    }

    const { params, requestType } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 10000),
    });

    if (timeout) {
      throw new Error('Timeout', 'TimeoutError');
    }

    // console.log('onLoadNotificationsRequest response', response);
    const { data, meta }: ApiResponsePayload = response;

    let finalData = data || undefined;

    if (data) {
      finalData = normalize(data, [NotificationSchema]);
    }

    yield put(loadNotificationsSuccess(requestPayload, finalData, meta, sagaActionChunk));
  } catch (e) {
    console.log('onLoadNotificationsRequest catch', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loadNotificationsFailure(requestPayload, errorMessage, sagaActionChunk));
  }
}

export function getDefaultSince() {
  return moment().subtract(1, 'month').format();;
}

export function getParamsToLoadAllNotifications() {
  return { all: true, since: getDefaultSince() };
}

export function* getParamsToLoadOnlyNewNotifications() {
  const state = yield select();
  const lastModifiedAt = lastModifiedAtSelector(state);

  const defaultSince = getDefaultSince();
  return {
    all: true,
    since: defaultSince,
    headers: {
      'If-Modified-Since': dateToHeaderFormat(lastModifiedAt || defaultSince),
    },
  };
}

function* onUpdateNotificationsRequest({ payload: { params: _params }}) {
  const params = _params || (yield getParamsToLoadOnlyNewNotifications());
  yield put(loadNotificationsRequest(params, sagaActionChunk));
}

// update user notifications each minute
function* startTimer() {
  yield take(REHYDRATE);

  // when the user opens the app, load ALL notifications.
  // and then on each minute load only the new notifications
  // to optimize polling with If-Modified-Since header
  let params = getParamsToLoadAllNotifications();

  while (true) {
    const state = yield select();
    const isLogged = isLoggedSelector(state);

    if (isLogged) {
      yield put(updateNotifications(params, sagaActionChunk));
      params = yield getParamsToLoadOnlyNewNotifications();

      const { logout } = yield race({
        delay: call(delay, 60 * 1000),
        logout: take([LOGIN_SUCCESS, LOGOUT]),
      });

      if (logout) {
        params = getParamsToLoadAllNotifications();
      }
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
