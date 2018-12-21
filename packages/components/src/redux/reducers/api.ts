import immer from 'immer'

import { GitHubApiHeaders } from '@devhub/core'
import { Reducer } from '../types'

export interface State {
  github?: GitHubApiHeaders
}

const initialState: State = {
  github: {
    pollInterval: undefined,
    rateLimitLimit: undefined,
    rateLimitRemaining: undefined,
    rateLimitReset: undefined,
  },
}

export const apiReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SUBSCRIPTION_SUCCESS':
    case 'FETCH_SUBSCRIPTION_FAILURE':
      return immer(state, draft => {
        if (!action.payload.github) return

        draft.github = {
          ...draft.github,
          ...action.payload.github,
        }
      })

    default:
      return state
  }
}
