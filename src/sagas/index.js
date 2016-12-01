// @flow

import { flatten, unique } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { takeEvery, takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';

import { EventSchema } from '../utils/normalizr/schemas';

import {
  LOAD_SUBSCRIPTION_DATA_REQUEST,
  UPDATE_COLUMN_SUBSCRIPTIONS,
} from '../utils/constants/actions';

import type { Action, ApiRequestPayload, ApiResponsePayload } from '../utils/types';

import {
  loadSubscriptionDataRequest,
  loadSubscriptionDataSuccess,
  loadSubscriptionDataFailure,
} from '../actions';

import { getApiMethod } from '../api/github';

export function* loadSubscriptionData({ payload }: Action<ApiRequestPayload>) {
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

export function* updateSubscriptionsFromColumn({ payload: { id } }: Action<ApiRequestPayload>) {
  const state = yield select();
  if (!state) return null;

  const column = state.entities.columns[id];
  if (!column) return null;

  const subscriptionIds = column.subscriptions || [];
  if (!(subscriptionIds.length > 0)) return null;

  return yield subscriptionIds.map(function* (subscriptionId) {
    const subscription = state.entities.subscriptions[subscriptionId];
    if (!subscription) return null;

    const { requestType, params } = subscription;
    if (!(requestType && params)) return null;

    return yield put(loadSubscriptionDataRequest(requestType, params));
  }).filter(Boolean);
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
  ];
}
