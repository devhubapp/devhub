// @flow

import { AsyncStorage } from 'react-native';
import { fork, takeLatest } from 'redux-saga/effects';

import { RESET_APP_DATA } from '../utils/constants/actions';

import appSagas from './app';
import authSagas from './auth';
import columnsSagas from './columns';
import firebaseSagas from './firebase';
import notificationsSagas from './notifications';
import subscriptionsSagas from './subscriptions';

export async function resetAppData() {
  try {
    console.log('Reseting app data...');
    await AsyncStorage.clear();
    console.log('Reseted.');
  } catch (e) {
    console.error('Failed to reset app data', e);
  }
}

export default function* () {
  return yield [
    yield takeLatest(RESET_APP_DATA, resetAppData),
    yield fork(authSagas),
    yield fork(columnsSagas),
    yield fork(firebaseSagas),
    yield fork(notificationsSagas),
    yield fork(subscriptionsSagas),
    yield fork(appSagas),
  ];
}
