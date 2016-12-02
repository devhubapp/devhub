// @flow

import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, take, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select } from 'redux-saga/effects';

import { EventSchema } from '../utils/normalizr/schemas';

import {
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  UPDATE_COLUMN_SUBSCRIPTIONS,
  UPDATE_ALL_COLUMNS_SUBSCRIPTIONS,
} from '../utils/constants/actions';

import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadSubscriptionDataRequest,
  loadSubscriptionDataSuccess,
  loadSubscriptionDataFailure,
} from '../actions';

import { getApiMethod } from '../api/github';

const columnsSelector = state => state.entities.columns;
const subscriptionsSelector = state => state.entities.subscriptions;

function* loadSubscriptionData({ payload }: Action<ApiRequestPayload>) {
  try {
    const { requestType, params } = payload;

    const { response, timeout } = yield race({
      response: call(getApiMethod(requestType), params),
      timeout: call(delay, 5000),
    });

    if (timeout) throw new Error('Timeout');

    const { data, meta }: ApiResponsePayload = response;
    const normalizedData = normalize(data, arrayOf(EventSchema));

    yield put(loadSubscriptionDataSuccess(payload, normalizedData, meta));
  } catch (error) {
    yield put(loadSubscriptionDataFailure(payload, error));
  }
}

function* updateSubscriptionsFromColumn({ payload: { id } }: Action<ApiRequestPayload>) {
  try {
    const state = yield select();

    const columns = columnsSelector(state);
    const subscriptions = subscriptionsSelector(state);
    if (!(columns && subscriptions)) return null;

    const column = columns[id];
    if (!column) return null;

    const subscriptionIds = column.subscriptions || [];
    if (!(subscriptionIds.length > 0)) return null;

    return yield subscriptionIds.map(function*(subscriptionId) {
      const subscription = subscriptions[subscriptionId];
      if (!subscription) return null;

      const { requestType, params } = subscription;
      if (!(requestType && params)) return null;

      return yield put(loadSubscriptionDataRequest(requestType, params));
    }).filter(Boolean);
  } catch (e) {}
}

function* updateSubscriptionsFromAllColumns() {
  try {
    const state = yield select();

    const columns = columnsSelector(state);
    const subscriptions = subscriptionsSelector(state);
    if (!(columns && subscriptions)) return null;

    const columnIds = Object.keys(columns) || [];
    if (!(columnIds.length > 0)) return null;

    const subscriptionIds = uniq(flatten(columnIds.map(columnId => {
      const column = columns[columnId];
      if (!column) return null;

      return column.subscriptions || [];
    }))).filter(Boolean);

    return yield subscriptionIds.map(function*(subscriptionId) {
      const subscription = subscriptions[subscriptionId];
      if (!subscription) return null;

      const { requestType, params } = subscription;
      if (!(requestType && params)) return null;

      return yield put(loadSubscriptionDataRequest(requestType, params));
    }).filter(Boolean);
  } catch (e) {}
}

function* runTimer() {
  try {
    while (true) {
      yield call(delay, 60 * 1000); // update all columns each minute
      yield updateSubscriptionsFromAllColumns();
    }
  } catch (e) {}
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield fork(runTimer),
  ];
}
