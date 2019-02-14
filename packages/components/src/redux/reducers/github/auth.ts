import _ from 'lodash'

import { User } from '@devhub/core'
import { Reducer } from '../../types'

export interface State {
  app: User['github']['app']
  oauth: User['github']['oauth']
  user: User['github']['user'] | undefined
}

const initialState: State = {
  app: undefined,
  oauth: undefined,
  user: undefined,
}

export const githubAuthReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        app: action.payload.user.github.app,
        oauth: action.payload.user.github.oauth,
        user: action.payload.user.github.user,
      }

    case 'LOGIN_FAILURE':
      return initialState

    default:
      return state
  }
}
