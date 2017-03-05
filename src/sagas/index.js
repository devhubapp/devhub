// @flow

import { AsyncStorage } from 'react-native';
import { delay } from 'redux-saga';
import { call, fork, put, race, select, take, takeLatest } from 'redux-saga/effects';
import { REHYDRATE } from 'redux-persist/constants';

import { resetAppData as resetAppDataAction } from '../actions';
import { RESET_APP_DATA_REQUEST } from '../utils/constants/actions';
import { rehydratedSelector } from '../selectors';

import appSagas from './app';
import authSagas from './auth';
import columnsSagas from './columns';
import firebaseSagas from './firebase';
import notificationsSagas from './notifications';
import subscriptionsSagas from './subscriptions';

export function* resetAppData() {
  try {
    console.log('Reseting app data...');
    yield AsyncStorage.clear();
    console.log('Reseted.');
  } catch (e) {
    console.error('Failed to reset app data', e);
  }
}

function* onResetAppDataRequest() {
  const rehydrated = yield select(rehydratedSelector);

  // only reset after rehydration otherise it would restore the data after the reset
  if (!rehydrated) {
    yield race({
      rehydrated: take(REHYDRATE),
      timeout: call(delay, 1000),
    });
  }

  yield put(resetAppDataAction());
}

export default function* () {
  return yield [
    yield takeLatest(RESET_APP_DATA_REQUEST, onResetAppDataRequest),
    yield fork(authSagas),
    yield fork(columnsSagas),
    yield fork(firebaseSagas),
    yield fork(notificationsSagas),
    yield fork(subscriptionsSagas),
    yield fork(appSagas),
  ];
}
