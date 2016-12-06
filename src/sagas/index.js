// @flow

import { AsyncStorage } from 'react-native';
import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { EventSchema } from '../utils/normalizr/schemas';
import { columnSelector, columnsIdsSelector } from '../selectors/columns';
import { columnSubscriptionsIdsSelector, subscriptionSelector } from '../selectors/subscriptions';

import {
  CLEAR_CACHE,
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
    const { requestType, params } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 10000),
    });

    if (timeout) throw new Error('TimeoutError', 'Timeout');

    const { data, meta }: ApiResponsePayload = response;
    const normalizedData = normalize(data, arrayOf(EventSchema));

    yield put(loadSubscriptionDataSuccess(payload, normalizedData, meta, sagaActionChunk));
  } catch (error) {
    console.log('loadSubscriptionData catch', error);
    yield put(loadSubscriptionDataFailure(payload, error, sagaActionChunk));
  }
}

function* updateSubscriptionsFromColumn({ payload: { id: columnId } }: Action<ApiRequestPayload>) {
  const state = yield select();

  const column = columnSelector(state, { id: columnId });
  const subscriptionIds = columnSubscriptionsIdsSelector(state, { column });
  if (!(subscriptionIds.size > 0)) return;

  yield* subscriptionIds.map(function* (subscriptionId) {
    const subscription = subscriptionSelector(state, { id: subscriptionId });
    if (!subscription) return;

    const { requestType, params } = subscription.toJS();
    if (!(requestType && params)) return;

    yield put(loadSubscriptionDataRequest(requestType, params, sagaActionChunk));
  });
}

function* updateSubscriptionsFromAllColumns() {
  const state = yield select();

  const columnIds = columnsIdsSelector(state);
  if (!(columnIds.size > 0)) return;

  const subscriptionIds = uniq(flatten(columnIds.map(id => {
    const column = columnSelector(state, { id });
    return columnSubscriptionsIdsSelector(state, { column });
  }).toJS())).filter(Boolean);

  yield* subscriptionIds.map(function* (subscriptionId) {
    const subscription = subscriptionSelector(state, { id: subscriptionId });
    if (!subscription) return;

    const { requestType, params } = subscription.toJS();
    if (!(requestType && params)) return;

    yield put(loadSubscriptionDataRequest(requestType, params, sagaActionChunk));
  });
}

function* startTimer() {
  yield take(REHYDRATE);

  while (true) {
    yield put(updateAllColumnsSubscriptions(sagaActionChunk));
    yield call(delay, 60 * 1000); // update all columns each minute
  }
}

function* clearCache() {
  yield AsyncStorage.clear();
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield takeLatest(CLEAR_CACHE, clearCache),
    yield fork(startTimer),
  ];
}
