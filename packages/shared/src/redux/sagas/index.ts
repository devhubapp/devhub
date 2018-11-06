import { all, fork } from 'redux-saga/effects'

import { authSagas } from './auth'
import { columnsSagas } from './columns'
import { configSagas } from './config'

export function* rootSaga() {
  yield all([
    yield fork(authSagas),
    yield fork(columnsSagas),
    yield fork(configSagas),
  ])
}
