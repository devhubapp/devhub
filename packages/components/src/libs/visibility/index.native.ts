import _ from 'lodash'
import { AppState, AppStateStatus } from 'react-native'

export function isSupported() {
  return true
}

export function isVisible() {
  return AppState.currentState === 'active'
}

const memoizedCallback = _.memoize(
  (callback: (isVisible: boolean | null) => void) => (
    state: AppStateStatus,
  ) => {
    callback(state === 'active')
  },
)

export function addEventListener(
  callback: (isVisible: boolean | null) => void,
) {
  AppState.addEventListener('change', memoizedCallback(callback))
}

export function removeEventListener(
  callback: (isVisible: boolean | null) => void,
) {
  AppState.removeEventListener('change', memoizedCallback(callback))
}
