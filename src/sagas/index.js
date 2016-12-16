// @flow

import moment from 'moment';
import { AsyncStorage } from 'react-native';
import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { EventSchema } from '../utils/normalizr/schemas';
import { columnIdsSelector, columnSubscriptionIdsSelector, subscriptionSelector } from '../selectors';

import {
  CLEAR_APP_DATA,
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
} from '../utils/constants/actions';

import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadSubscriptionDataRequest,
  loadSubscriptionDataSuccess,
  loadSubscriptionDataFailure,
  updateAllColumnsSubscriptions,
} from '../actions';

import { getApiMethod } from '../api/github';

const sagaActionChunk = { dispatchedBySaga: true };

function* loadSubscriptionData({ payload }: Action<ApiRequestPayload>) {
  try {
    const { params, requestType, subscriptionId } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 10000),
    });

    if (timeout) throw new Error('Timeout', 'TimeoutError');

    const { data, meta }: ApiResponsePayload = response;

    let onlyNewEvents = data;

    const state = yield select();
    const subscription = subscriptionSelector(state, { subscriptionId });
    const subscriptionUpdatedAt = subscription.get('updatedAt') ? moment(subscription.get('updatedAt')) : null;

    // remove old events, that were already fetched
    if (subscriptionUpdatedAt && subscriptionUpdatedAt.isValid()) {
      onlyNewEvents = onlyNewEvents.filter(event => (
        !event.created_at || moment(event.created_at).isAfter(subscriptionUpdatedAt)
      ));
    }

    const normalizedData = normalize(onlyNewEvents, arrayOf(EventSchema));
    yield put(loadSubscriptionDataSuccess(payload, normalizedData, meta, sagaActionChunk));

  } catch (error) {
    console.log('loadSubscriptionData catch', error);
    const errorMessage = (error.message || {}).message || error.message || error.body || error.status;
    yield put(loadSubscriptionDataFailure(payload, errorMessage, sagaActionChunk));
  }
}

function* updateSubscriptionsFromColumn({ payload: { id: columnId } }: Action<ApiRequestPayload>) {
  const state = yield select();

  const subscriptionIds = columnSubscriptionIdsSelector(state, { columnId });
  if (!(subscriptionIds.size > 0)) return;

  yield* subscriptionIds.map(function* (subscriptionId) {
    const subscription = subscriptionSelector(state, { subscriptionId });
    if (!subscription) return;

    const { requestType, params } = subscription.toJS();
    if (!(requestType && params)) return;

    yield put(loadSubscriptionDataRequest(requestType, params, sagaActionChunk));
  });
}

function* updateSubscriptionsFromAllColumns() {
  const state = yield select();

  const columnIds = columnIdsSelector(state);
  if (!(columnIds.size > 0)) return;

  const subscriptionIds = uniq(flatten(columnIds.map(columnId => (
    columnSubscriptionIdsSelector(state, { columnId })
  )).toJS())).filter(Boolean);

  yield* subscriptionIds.map(function* (subscriptionId) {
    const subscription = subscriptionSelector(state, { subscriptionId });
    if (!subscription) return;

    const { requestType, params } = subscription.toJS();
    if (!(requestType && params)) return;

    yield put(loadSubscriptionDataRequest(requestType, params, sagaActionChunk));
  });
}

function* startTimer() {
  yield take(REHYDRATE);

 // update all columns each minute
  while (true) {
    yield put(updateAllColumnsSubscriptions(sagaActionChunk));
    yield call(delay, 60 * 1000);
  }
}

function* clearAppData() {
  yield AsyncStorage.clear();
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield takeLatest(CLEAR_APP_DATA, clearAppData),
    yield fork(startTimer),
  ];
}
