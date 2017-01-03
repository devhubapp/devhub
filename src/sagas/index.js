// @flow

import { AsyncStorage } from 'react-native';
import { fork, takeLatest } from 'redux-saga/effects';

import {
  CLEAR_APP_DATA,
} from '../utils/constants/actions';

import authSagas from './auth';
import notificationsSagas from './notifications';
import subscriptionsSagas from './subscriptions';

export async function clearAppData() {
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
    yield takeLatest(CLEAR_APP_DATA, clearAppData),
    yield fork(authSagas),
    yield fork(notificationsSagas),
    yield fork(subscriptionsSagas),
  ];
}
