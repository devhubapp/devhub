import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../types'

const initialState = {
  loginSuccess: 0,
}

export type State = typeof initialState

export const countReducer: Reducer<State> = (
  state = initialState,
  action,
): State => {
  switch (action.type) {
    case REHYDRATE as any: {
      const { err, payload } = action as any

      const counters: State = err ? state : payload && payload.counters

      return {
        ...initialState,
        ...(_.pick(counters, Object.keys(initialState)) as any),
      }
    }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginSuccess: (state.loginSuccess || 0) + 1,
      }

    default:
      return state
  }
}
