import { constants, User } from '@devhub/core'
import { REHYDRATE } from 'redux-persist'

import { Reducer } from '../../types'

export interface State {
  app: User['github']['app']
  oauth: User['github']['oauth']
  personal: User['github']['personal']
  user: User['github']['user'] | undefined
}

const initialState: State = {
  app: undefined,
  oauth: undefined,
  personal: undefined,
  user: undefined,
}

export const githubAuthReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case REHYDRATE as any: {
      return {
        ...initialState,
        ...(action as any).payload?.github?.auth,
      }
    }

    case 'LOGIN_SUCCESS':
      return {
        app: action.payload.user.github.app,
        oauth: action.payload.user.github.oauth,
        personal: constants.LOCAL_ONLY_PERSONAL_ACCESS_TOKEN
          ? state.personal
          : action.payload.user.github.personal,
        user: action.payload.user.github.user,
      }

    case 'REPLACE_PERSONAL_TOKEN_DETAILS':
      return {
        ...state,
        personal: action.payload.tokenDetails,
      }

    case 'LOGIN_FAILURE':
      return initialState

    default:
      return state
  }
}
