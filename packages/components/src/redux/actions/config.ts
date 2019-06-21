import { AppViewMode, ThemePair } from '@devhub/core'
import { createAction } from '../helpers'

export function setTheme(payload: {
  id: ThemePair['id']
  color?: ThemePair['color']
}) {
  return createAction('SET_THEME', payload)
}

export function setPreferrableTheme(payload: {
  id: ThemePair['id']
  color?: ThemePair['color']
}) {
  return createAction('SET_PREFERRABLE_THEME', payload)
}

export function dayNightSwitch() {
  return createAction('DAY_NIGHT_SWITCH')
}

export function setAppViewMode(appViewMode: AppViewMode) {
  return createAction('SET_APP_VIEW_MODE', appViewMode)
}

export function toggleAppViewMode() {
  return createAction('TOGGLE_APP_VIEW_MODE')
}
