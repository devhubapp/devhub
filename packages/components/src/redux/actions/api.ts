import { createAction } from '../helpers'

export function syncDown() {
  return createAction('SYNC_DOWN')
}

export function syncUp() {
  return createAction('SYNC_UP')
}
