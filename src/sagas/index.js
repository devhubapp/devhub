// @flow

import { AsyncStorage } from 'react-native'
import { delay } from 'redux-saga'
import {
  all,
  call,
  fork,
  put,
  race,
  select,
  take,
  takeLatest,
} from 'redux-saga/effects'
import { REHYDRATE } from 'redux-persist/constants'

import { resetAppData as resetAppDataAction } from '../actions'
import {
  RESET_ACCOUNT_DATA,
  RESET_ACCOUNT_DATA_REQUEST,
} from '../utils/constants/actions'
import { rehydratedSelector } from '../selectors'

import appSagas from './app'
import authSagas from './auth'
import columnsSagas from './columns'
import notificationsSagas from './notifications'
import subscriptionsSagas from './subscriptions'

export function* resetAppData() {
  try {
    if (__DEV__) console.debug('Reseting app data...')
    yield AsyncStorage.clear()
    if (__DEV__) console.debug('Reseted.')
  } catch (e) {
    console.error('Failed to reset app data', e)
  }
}

function* onResetAppDataRequest() {
  const rehydrated = yield select(rehydratedSelector)

  // only reset after rehydration otherise it would restore the data after the reset
  if (!rehydrated) {
    yield race({
      rehydrated: take(REHYDRATE),
      timeout: call(delay, 1000),
    })
  }

  yield put(resetAppDataAction())
}

export default function*() {
  return yield all([
    yield takeLatest(RESET_ACCOUNT_DATA_REQUEST, onResetAppDataRequest),
    yield takeLatest(RESET_ACCOUNT_DATA, resetAppData),
    yield fork(authSagas),
    yield fork(columnsSagas),
    yield fork(notificationsSagas),
    yield fork(subscriptionsSagas),
    yield fork(appSagas),
  ])
}
