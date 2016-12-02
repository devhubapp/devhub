// @flow

import { List } from 'immutable';
import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery, takeLatest } from 'redux-saga';
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

const columnsSelector = state => state.getIn(['entities', 'columns']);

const columnSelector = (state, id) => columnsSelector(state).get(id);

const columnsIdsSelector = state => columnsSelector(state).keySeq().toArray();

const columnSubscriptionsIdsSelector = (state, columnId) => (
  columnSelector(state, columnId).get('subscriptions').toArray()
);

const subscriptionsSelector = state => state.getIn(['entities', 'subscriptions']);
const subscriptionSelector = (state, id) => subscriptionsSelector(state).get(id);

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

    const subscriptionIds = columnSubscriptionsIdsSelector(state, id);
    if (!(subscriptionIds.length > 0)) return null;

    return yield subscriptionIds.map(function* (subscriptionId) {
      const subscription = subscriptionSelector(state, subscriptionId);
      if (!subscription) return null;

      const { requestType, params } = subscription.toJS();
      if (!(requestType && params)) return null;

      return yield put(loadSubscriptionDataRequest(requestType, params));
    }).filter(Boolean);
  } catch (error) {
    return yield put({ type: 'ERROR', error });
  }
}

function* updateSubscriptionsFromAllColumns() {
  try {
    const state = yield select();

    const columnIds = columnsIdsSelector(state);
    if (!(columnIds.length > 0)) return null;

    const subscriptionIds = uniq(flatten(columnIds.map(columnId => (
      columnSubscriptionsIdsSelector(columnId) || []
    )))).filter(Boolean);

    return yield subscriptionIds.map(function* (subscriptionId) {
      const subscription = subscriptionSelector(state, subscriptionId);
      if (!subscription) return null;

      const { requestType, params } = subscription.toJS();
      if (!(requestType && params)) return null;

      return yield put(loadSubscriptionDataRequest(requestType, params));
    }).filter(Boolean);
  } catch (error) {
    return yield put({ type: 'ERROR', error });
  }
}

function* runTimer() {
  try {
    while (true) {
      yield call(delay, 60 * 1000); // update all columns each minute
      yield updateSubscriptionsFromAllColumns();
    }
  } catch (error) {
    return yield put({ type: 'ERROR', error });
  }
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield fork(runTimer),
  ];
}
