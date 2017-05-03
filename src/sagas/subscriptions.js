// @flow

import moment from 'moment';
import { flatten, uniq } from 'lodash';
import { normalize } from 'normalizr';
import { delay } from 'redux-saga';
import {
  call,
  fork,
  put,
  race,
  select,
  take,
  takeEvery,
  takeLatest,
} from 'redux-saga/effects';

import { EventSchema } from '../utils/normalizr/schemas';

import {
  columnIdsSelector,
  columnSubscriptionIdsSelector,
  subscriptionSelector,
  accessTokenSelector,
  isLoggedSelector,
} from '../selectors';

import { fromJS } from '../utils/immutable';
import { TIMEOUT } from '../utils/constants/defaults';

import {
  APP_READY,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
} from '../utils/constants/actions';

import { dateToHeaderFormat } from '../utils/helpers';

import type {
  Action,
  ApiRequestPayload,
  ApiResponsePayload,
} from '../utils/types';

import {
  loadSubscriptionDataRequest,
  loadSubscriptionDataSuccess,
  loadSubscriptionDataFailure,
  updateAllColumnsSubscriptions,
} from '../actions';

import { authenticate, getApiMethod } from '../api/github';

import { sagaActionChunk } from './_shared';

function* loadSubscriptionData({ payload }: Action<ApiRequestPayload>) {
  let state = yield select();
  const accessToken = accessTokenSelector(state);

  yield call(authenticate, accessToken);

  // just to have the token on success/failure actions
  const requestPayload = { ...payload, accessToken };

  try {
    const { params, requestType, subscriptionId } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, TIMEOUT),
    });

    if (timeout) throw new Error('Timeout', 'TimeoutError');

    // console.log('loadSubscriptionData response', response);
    const { data, meta }: ApiResponsePayload = response || {};

    let finalData = data || undefined;

    // remove old events from data
    if (data && Array.isArray(data)) {
      let onlyNewEvents = data;

      state = yield select();
      const subscription = subscriptionSelector(state, { subscriptionId });
      if (!subscription) return;

      const subscriptionUpdatedAt = subscription.get('updatedAt')
        ? moment(subscription.get('updatedAt'))
        : null;

      // remove old events, that were already fetched
      if (subscriptionUpdatedAt && subscriptionUpdatedAt.isValid()) {
        onlyNewEvents = onlyNewEvents.filter(
          event =>
            !event.created_at ||
            moment(event.created_at).isAfter(subscriptionUpdatedAt),
        );
      }

      finalData = normalize(onlyNewEvents, [EventSchema]);
    }

    yield put(
      loadSubscriptionDataSuccess(
        requestPayload,
        finalData,
        meta,
        sagaActionChunk,
      ),
    );
  } catch (e) {
    console.log('loadSubscriptionData catch', e);
    const errorMessage =
      (e.message || {}).message || e.message || e.body || e.status;
    yield put(
      loadSubscriptionDataFailure(
        requestPayload,
        errorMessage,
        sagaActionChunk,
      ),
    );
  }
}

function* _loadSubscriptions(subscriptionIds) {
  if (!(subscriptionIds && typeof subscriptionIds.map === 'function')) return;
  if (!(subscriptionIds.length > 0)) return;

  const state = yield select();

  yield* subscriptionIds.map(function*(subscriptionId) {
    const subscription = subscriptionSelector(state, { subscriptionId });
    if (!subscription) return;

    const { requestType, params } = subscription.toJS();
    if (!(requestType && params)) return;

    const lastModifiedAt = new Date(subscription.get('lastModifiedAt'));
    params.headers = {};
    if (lastModifiedAt) {
      params.headers['If-Modified-Since'] = dateToHeaderFormat(lastModifiedAt);
    }

    yield put(
      loadSubscriptionDataRequest(requestType, params, sagaActionChunk),
    );
  });
}

function* updateSubscriptionsFromColumn({
  payload: { columnId },
}: Action<ApiRequestPayload>) {
  const state = yield select();

  const subscriptionIds = columnSubscriptionIdsSelector(state, {
    columnId,
  }).toJS();
  yield _loadSubscriptions(subscriptionIds);
}

function* updateSubscriptionsFromAllColumns() {
  const state = yield select();

  const columnIds = columnIdsSelector(state);
  if (!(columnIds.size > 0)) return;

  const subscriptionIds = uniq(
    flatten(
      columnIds
        .map(columnId => columnSubscriptionIdsSelector(state, { columnId }))
        .toJS(),
    ),
  ).filter(Boolean);

  yield _loadSubscriptions(subscriptionIds);
}

// update all columns each minute
function* startTimer() {
  yield take(APP_READY);

  // // alert with the size of the state in bytes
  // const byteCount = s => encodeURI(s).split(/%..|./).length - 1;
  // const _state = yield select();
  // alert(byteCount(JSON.stringify(_state)));

  while (true) {
    const state = yield select();
    const isLogged = isLoggedSelector(state);

    if (isLogged) {
      yield put(updateAllColumnsSubscriptions(sagaActionChunk));
      yield race({
        delay: call(delay, 60 * 1000),
        logout: take([LOGIN_SUCCESS, LOGOUT]),
      });
    } else {
      yield call(delay, 1000);
    }
  }
}

export default function*() {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(
      UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
      updateSubscriptionsFromAllColumns,
    ),
    yield fork(startTimer),
  ];
}
