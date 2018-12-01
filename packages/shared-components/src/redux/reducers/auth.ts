import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { User } from 'shared-core/dist/types/graphql'
import { Reducer } from '../types'

export interface State {
  appToken: string | null
  error: object | null
  githubScope: string[] | null
  githubToken: string | null
  githubTokenType: string | null
  isLoggingIn: boolean
  lastLoginAt: string | null
  user: User | null
}

const initialState: State = {
  appToken: null,
  error: null,
  githubScope: null,
  githubToken: null,
  githubTokenType: null,
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
        githubScope: action.payload.githubScope || state.githubScope,
        githubToken: action.payload.githubToken || state.githubToken,
        githubTokenType:
          action.payload.githubTokenType || state.githubTokenType,
        isLoggingIn: true,
        lastLoginAt: state.lastLoginAt,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return {
        appToken: action.payload.appToken || state.appToken,
        error: null,
        githubScope: action.payload.githubScope || state.githubScope,
        githubToken: action.payload.githubToken || state.githubToken,
        githubTokenType:
          action.payload.githubTokenType || state.githubTokenType,
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
