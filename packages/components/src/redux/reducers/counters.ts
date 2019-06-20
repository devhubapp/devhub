import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../types'

const initialState = {
  appViewModeChange: 0,
  loggedInAtMultiColumnMode: 0,
  loggedInAtSingleColumnMode: 0,
  loginSuccess: 0,
}

export type State = typeof initialState

export const countReducer: Reducer<State> = (
  state = initialState,
  action,
): State => {
  switch (action.type) {
    case REHYDRATE as any: {
      return {
        ...initialState,
        ...(_.pick(
          action.payload && (action.payload as any).counters,
          Object.keys(initialState),
        ) as any),
      }
    }

    case 'SET_APP_VIEW_MODE':
      return {
        ...state,
        appViewModeChange: (state.appViewModeChange || 0) + 1,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loginSuccess: (state.loginSuccess || 0) + 1,
        loggedInAtMultiColumnMode:
          action.payload.appViewMode === 'multi-column'
            ? (state.loggedInAtMultiColumnMode || 0) + 1
            : state.loggedInAtMultiColumnMode,
        loggedInAtSingleColumnMode:
          action.payload.appViewMode === 'single-column'
            ? (state.loggedInAtSingleColumnMode || 0) + 1
            : state.loggedInAtSingleColumnMode,
      }

    default:
      return state
  }
}
