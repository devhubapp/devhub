import immer from 'immer'

import { GitHubAPIHeaders } from '@devhub/core'
import { Reducer } from '../../types'

export interface State {
  headers?: GitHubAPIHeaders
}

const initialState: State = {
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
    case 'FETCH_SUBSCRIPTION_SUCCESS':
    case 'FETCH_SUBSCRIPTION_FAILURE':
      return immer(state, (draft) => {
        if (!action.payload.github) return

        draft.headers = {
          ...draft.headers,
          ...action.payload.github.headers,
        }
      })

    default:
      return state
  }
}
