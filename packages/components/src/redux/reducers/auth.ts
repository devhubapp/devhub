import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { User } from '@devhub/core/dist/types/graphql'
import { Reducer } from '../types'

export interface State {
  appToken: string | null
  error: object | null
  isLoggingIn: boolean
  user: User | null
}

const initialState: State = {
  appToken: null,
  error: null,
  isLoggingIn: false,
  user: null,
}

export const authReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE as any:
      return {
        ...(action.payload && (action.payload as any).auth),
        ..._.pick(initialState, ['error', 'isLoggingIn']),
      }

    case 'LOGIN_REQUEST':
      return {
        appToken: action.payload.appToken,
        error: null,
        isLoggingIn: true,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return {
        appToken: action.payload.appToken || state.appToken,
        error: null,
        isLoggingIn: false,
        user: action.payload.user && {
          ...action.payload.user,
          lastLoginAt:
            action.payload.user.lastLoginAt || new Date().toISOString(),
        },
      }

    case 'LOGIN_FAILURE':
      return {
        ...initialState,
        error: action.error,
      }

    default:
      return state
  }
}
