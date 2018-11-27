import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { User } from 'shared-core/dist/types/graphql'
import { Reducer } from '../types'

export interface State {
  appToken: string | null
  error: object | null
  githubToken: string | null
  isLoggingIn: boolean
  lastLoginAt: string | null
  user: User | null
}

const initialState: State = {
  appToken: null,
  error: null,
  githubToken: null,
  isLoggingIn: false,
  lastLoginAt: null,
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
        githubToken: action.payload.githubToken,
        isLoggingIn: true,
        lastLoginAt: state.lastLoginAt,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return {
        appToken: action.payload.appToken || state.appToken,
        error: null,
        githubToken: action.payload.githubToken || state.githubToken,
        isLoggingIn: false,
        lastLoginAt: new Date().toISOString(),
        user: action.payload.user,
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
