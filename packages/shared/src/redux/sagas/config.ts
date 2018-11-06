import { delay } from 'redux-saga'
import { all, fork, put } from 'redux-saga/effects'

import { isNight } from '../../utils/helpers/shared'
import * as actions from '../actions'

let wasNight
function* init() {
  wasNight = isNight()

  while (true) {
    yield delay(30 * 1000)
    if (wasNight === isNight()) continue

    wasNight = isNight()
    yield put(actions.dayNightSwitch())
  }
}

export function* configSagas() {
  yield all([yield fork(init)])
}
