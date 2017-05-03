// @flow

import { Map } from 'immutable'
import { REHYDRATE } from 'redux-persist/constants'

import { APP_READY, RESET_APP_DATA } from '../../utils/constants/actions'
import pkg from '../../../package.json'
import type { Action } from '../../utils/types'

const initialState = Map({
  codeBundleId: pkg.codeBundleId,
  ready: false,
  rehydrated: false,
  version: pkg.version,
})

type State = {
  codeBundleId: string,
  ready: boolean,
  rehydrated: boolean,
  version: string,
}

export default (
  state: State = initialState,
  { type }: Action<any> = {},
): State => {
  switch (type) {
    case APP_READY:
      return state.set('ready', true)

    case RESET_APP_DATA:
      return state.set('ready', true).set('rehydrated', true)

    case REHYDRATE:
      return state.set('rehydrated', true)

    default:
      return state
  }
}
