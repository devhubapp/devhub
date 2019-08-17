import { ThemePair } from '@devhub/core'
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
