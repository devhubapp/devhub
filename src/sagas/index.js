// @flow

import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

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

const getColumns = state => state.entities.columns;
const getSubscriptions = state => state.entities.subscriptions;

function* loadSubscriptionData({ payload }: Action<ApiRequestPayload>) {
  try {
    const { requestType, params } = payload;

    const { data, meta }: ApiResponsePayload = (
      yield call(getApiMethod(requestType), params)
    );

    const normalizedData = normalize(data, arrayOf(EventSchema));

    yield put(loadSubscriptionDataSuccess(payload, normalizedData, meta));
  } catch (error) {
    yield put(loadSubscriptionDataFailure(payload, error));
  }
}

function* updateSubscriptionsFromColumn({ payload: { id } }: Action<ApiRequestPayload>) {
  const state = yield select();

  const columns = getColumns(state);
  const subscriptions = getSubscriptions(state);
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
}

function* updateSubscriptionsFromAllColumns() {
  const state = yield select();

  const columns = getColumns(state);
  const subscriptions = getSubscriptions(state);
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
}

function* runTimer() {
  while (true) {
    yield call(delay, 60 * 1000); // update all columns each minute
    yield updateSubscriptionsFromAllColumns();
  }
}

export default function*() {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield runTimer(),
  ];
}
