import immer from 'immer'
import { REHYDRATE } from 'redux-persist'

import { GitHubAPIHeaders } from '@devhub/core'

import { Reducer } from '../../types'

export interface State {
  baseApiUrl: string
  baseUrl: string
  headers?: GitHubAPIHeaders
}

const initialState: State = {
  baseApiUrl: 'https://api.github.com',
  baseUrl: 'https://github.com',
  headers: {
    pollInterval: undefined,
    rateLimitLimit: undefined,
    rateLimitRemaining: undefined,
    rateLimitReset: undefined,
  },
}

export const githubAPIReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      return {
        ...initialState,
        ...(action as any).payload?.github?.api,
      }
    }

    case 'FETCH_SUBSCRIPTION_SUCCESS':
    case 'FETCH_SUBSCRIPTION_FAILURE':
      return immer(state, (draft) => {
        if (!action.payload?.github?.headers) return

        draft.headers = {
          ...draft.headers,
          ...action.payload.github.headers,
        }
      })

    default:
      return state
  }
}
