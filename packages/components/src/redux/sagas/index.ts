// @ts-nocheck

import { all, fork } from 'redux-saga/effects'

import { apiSagas } from './api'
import { authSagas } from './auth'
import { columnsSagas } from './columns'
import { configSagas } from './config'
import { installationSagas } from './installations'
import { subscriptionsSagas } from './subscriptions'

export function* rootSaga() {
  yield all([
    yield fork(apiSagas),
    yield fork(authSagas),
    yield fork(columnsSagas),
    yield fork(configSagas),
    yield fork(installationSagas),
    yield fork(subscriptionsSagas),
  ])
}
