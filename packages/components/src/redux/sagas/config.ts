import { all, delay, fork, put, select, takeLatest } from 'redux-saga/effects'

import { isNight } from '@devhub/core'
import { analytics } from '../../libs/analytics'
import * as actions from '../actions'
import * as selectors from '../selectors'

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

function* onSetAppViewMode() {
  const state = yield select()

  const appViewMode = selectors.appViewModeSelector(state)

  analytics.setDimensions({
    layout_mode: appViewMode,
  })
}

function* onThemeChange() {
  const state = yield select()

  const preferredDarkThemePair = selectors.preferredDarkThemePairSelector(state)
  const preferredLightThemePair = selectors.preferredLightThemePairSelector(
    state,
  )
  const themePair = selectors.themePairSelector(state)

  analytics.setDimensions({
    dark_theme_id: preferredDarkThemePair.id,
    light_theme_id: preferredLightThemePair.id,
    theme_id: themePair.id,
  })
}

export function* configSagas() {
  yield all([
    yield fork(init),
    yield takeLatest(['SET_THEME', 'SET_PREFERRABLE_THEME'], onThemeChange),
    yield takeLatest(
      ['SET_APP_VIEW_MODE', 'TOGGLE_APP_VIEW_MODE'],
      onSetAppViewMode,
    ),
  ])
}
