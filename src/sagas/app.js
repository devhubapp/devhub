// @flow

import { call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';
import { Map, Set } from 'immutable';

import { APP_CLEANUP } from '../utils/constants/actions';
import {
  columnSubscriptionIdsSelector,
  columnsEntitySelector,
  eventIdsSelector,
  isReadySelector,
  subscriptionEventsSelector,
  subscriptionIdsSelector,
} from '../selectors';
import {
  appReady,
  cleanupApp,
  deleteEvents,
  deleteSubscription,
} from '../actions';
import { sagaActionChunk } from './_shared';

function* _getUsedSubscriptionIds() {
  const state = yield select();

  const columns = columnsEntitySelector(state);
  return (columns || Map())
    .toSet()
    .reduce(
      (resultIds, column) =>
        resultIds &&
        resultIds.union(
          columnSubscriptionIdsSelector(state, { columnId: column.get('id') }),
        ),
      Set(),
    );
}

function* cleanupEvents() {
  const state = yield select();

  const allEventIds = (eventIdsSelector(state) || Set()).toSet();
  if (!allEventIds.size) return;

  const usedSubscriptionIds = yield call(_getUsedSubscriptionIds);

  const usedEventIds = usedSubscriptionIds
    .map(subscriptionId =>
      subscriptionEventsSelector(state, { subscriptionId }),
    )
    .filter(Boolean)
    .toSet()
    .reduce((resultIds, currentIds) => resultIds.union(Set(currentIds)), Set());

  const eventIdsToRemove = allEventIds
    .union(usedEventIds)
    .subtract(allEventIds.intersect(usedEventIds));
  if (!eventIdsToRemove.size) return;

  yield put(deleteEvents({ eventIds: eventIdsToRemove }, sagaActionChunk));
}

function* cleanupSubscription(subscriptionId) {
  yield put(deleteSubscription(subscriptionId, sagaActionChunk));
}

function* cleanupSubscriptions() {
  const state = yield select();

  let allSubscriptionIds = (subscriptionIdsSelector(state) || Set()).toSet();
  if (!allSubscriptionIds.size) return;

  const usedSubscriptionIds = yield call(_getUsedSubscriptionIds) || Set();
  allSubscriptionIds = allSubscriptionIds.union(usedSubscriptionIds);

  const subscriptionIdsToRemove = allSubscriptionIds
    .union(usedSubscriptionIds)
    .subtract(allSubscriptionIds.intersect(usedSubscriptionIds));
  if (!subscriptionIdsToRemove.size) return;

  yield* subscriptionIdsToRemove.map(cleanupSubscription);
}

function* onCleanupAppRequest() {
  yield call(cleanupSubscriptions);
  yield call(cleanupEvents);

  const isAppReady = yield select(isReadySelector);
  if (!isAppReady) yield put(appReady(sagaActionChunk));
}

// when the user opens the app, deletes unsuded entities like events and subscriptions
// to optimize storage and performance
export function* start() {
  yield take(REHYDRATE);
  yield put(cleanupApp(sagaActionChunk));
}

export default function*() {
  return yield [
    yield fork(start),
    yield takeLatest(APP_CLEANUP, onCleanupAppRequest),
  ];
}
