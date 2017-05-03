// @flow

import moment from 'moment'
import { Map } from 'immutable'

import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  UPDATE_CURRENT_USER,
} from '../../utils/constants/actions'

import type {
  Action,
  LoginRequestPayload,
  LoginResponsePayload,
} from '../../utils/types'

const initialState = Map({})

type State = { isLogging: boolean, accessToken: string, loggedAt: Object }
type ActionType = Action<LoginRequestPayload | LoginResponsePayload>

export default (
  state: State = initialState,
  { type, payload: _payload, error }: ?ActionType = {},
): State => {
  const payload = _payload || {}

  switch (type) {
    case LOGIN_REQUEST:
      return state.set('isLogging', true)

    case LOGIN_SUCCESS:
      return state.mergeDeep({
        isLogging: false,
        accessToken: payload.data.accessToken,
        loggedAt: moment().toISOString(),
        lastAccessedAt: moment().toISOString(),
      })

    case UPDATE_CURRENT_USER:
      return state
        .mergeDeep(payload)
        .set(
          'lastAccessedAt',
          payload.lastAccessedAt || state.get('lastAccessedAt'),
        )

    case LOGIN_FAILURE:
      return Map({ isLogging: false, error })

    case LOGOUT:
      return Map({ loggedOutAt: moment().toISOString() })

    default:
      return state
  }
}
