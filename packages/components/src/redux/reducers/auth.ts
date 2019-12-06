import { User } from '@devhub/core'
import immer from 'immer'
import _ from 'lodash'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../types'

export interface AuthError {
  name: string
  message: string
  status?: number
  response?: any
}

export interface State {
  appToken: string | null
  error: AuthError | null
  isDeletingAccount: boolean
  isLoggingIn: boolean
  user: Pick<
    User,
    | '_id'
    | 'plan'
    | 'lastLoginAt'
    | 'freeTrialStartAt'
    | 'freeTrialEndAt'
    | 'createdAt'
    | 'updatedAt'
  > | null
}

const initialState: State = {
  appToken: null,
  error: null,
  isDeletingAccount: false,
  isLoggingIn: false,
  user: null,
}

export const authReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE as any: {
      const { err, payload } = action as any

      const auth: State = err ? state : payload && payload.auth

      return {
        ...auth,
        ..._.pick(initialState, ['error', 'isDeletingAccount', 'isLoggingIn']),
      }
    }

    case 'LOGIN_REQUEST':
      return {
        ...state,
        appToken: action.payload.appToken,
        error: null,
        isDeletingAccount: false,
        isLoggingIn: true,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return immer(state, draft => {
        draft.appToken = action.payload.appToken || state.appToken
        draft.error = null
        draft.isDeletingAccount = false
        draft.isLoggingIn = false

        if (action.payload.user) {
          draft.user = draft.user || ({} as any)
          draft.user!._id = action.payload.user._id
          draft.user!.freeTrialStartAt = action.payload.user.freeTrialStartAt
          draft.user!.freeTrialEndAt = action.payload.user.freeTrialEndAt

          if (action.payload.user.plan) {
            if (
              !draft.user!.plan ||
              JSON.stringify(draft.user!.plan) !==
                JSON.stringify(action.payload.user.plan)
            ) {
              draft.user!.plan = action.payload.user.plan
            }
          }

          draft.user!.lastLoginAt =
            action.payload.user.lastLoginAt || new Date().toISOString()
          draft.user!.createdAt = action.payload.user.createdAt
          draft.user!.updatedAt = action.payload.user.updatedAt
        }
      })

    case 'LOGIN_FAILURE':
      return {
        ...initialState,
        error: action.error,
      }

    case 'UPDATE_USER_DATA': {
      return immer(state, draft => {
        draft.user = draft.user || ({} as any)

        if (action.payload.plan) {
          draft.user!.plan = draft.user!.plan || ({} as any)
          Object.assign(draft.user!.plan, action.payload.plan)
        }
      })
    }

    case 'DELETE_ACCOUNT_REQUEST':
      return {
        ...state,
        isDeletingAccount: true,
      }

    case 'DELETE_ACCOUNT_SUCCESS':
      return {
        ...state,
        isDeletingAccount: false,
      }

    case 'DELETE_ACCOUNT_FAILURE':
      return {
        ...state,
        isDeletingAccount: false,
      }

    default:
      return state
  }
}
