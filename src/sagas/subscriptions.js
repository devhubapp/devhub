// @flow

import moment from 'moment';
import { flatten, uniq } from 'lodash';
import { arrayOf, normalize } from 'normalizr';
import { delay, takeEvery, takeLatest } from 'redux-saga';
import { call, fork, put, race, select, take } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { EventSchema } from '../utils/normalizr/schemas';
import {
  columnIdsSelector,
  columnSubscriptionIdsSelector,
  subscriptionSelector,
  accessTokenSelector,
  isLoggedSelector,
} from '../selectors';

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
  updateAllColumnsSubscriptions,
} from '../actions';

import { authenticate, getApiMethod } from '../api/github';

const sagaActionChunk = { dispatchedBySaga: true };

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
      timeout: call(delay, 10000),
    });

    if (timeout) throw new Error('Timeout', 'TimeoutError');

    // console.log('loadSubscriptionData response', response);
    const { data, meta }: ApiResponsePayload = response;
    if (!data) return;

    let onlyNewEvents = data;

    state = yield select();
    const subscription = subscriptionSelector(state, { subscriptionId });
    const subscriptionUpdatedAt = subscription.get('updatedAt') ? moment(subscription.get('updatedAt')) : null;

    // remove old events, that were already fetched
    if (subscriptionUpdatedAt && subscriptionUpdatedAt.isValid()) {
      onlyNewEvents = onlyNewEvents.filter(event => (
        !event.created_at || moment(event.created_at).isAfter(subscriptionUpdatedAt)
      ));
    }

    const normalizedData = normalize(onlyNewEvents, arrayOf(EventSchema));
    yield put(loadSubscriptionDataSuccess(requestPayload, normalizedData, meta, sagaActionChunk));
  } catch (e) {
    console.log('loadSubscriptionData catch', e);
    const errorMessage = (e.message || {}).message || e.message || e.body || e.status;
    yield put(loadSubscriptionDataFailure(requestPayload, errorMessage, sagaActionChunk));
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

// update all columns each minute
function* startTimer() {
  yield take(REHYDRATE);

  while (true) {
    const state = yield select();
    const isLogged = isLoggedSelector(state);

    if (isLogged) {
      yield put(updateAllColumnsSubscriptions(sagaActionChunk));
      yield call(delay, 60 * 1000);
    } else {
      yield call(delay, 1000);
    }
  }
}

export default function* () {
  return yield [
    yield takeEvery(LOAD_SUBSCRIPTION_DATA_REQUEST, loadSubscriptionData),
    yield takeEvery(UPDATE_COLUMN_SUBSCRIPTIONS, updateSubscriptionsFromColumn),
    yield takeLatest(UPDATE_ALL_COLUMNS_SUBSCRIPTIONS, updateSubscriptionsFromAllColumns),
    yield fork(startTimer),
  ];
}
