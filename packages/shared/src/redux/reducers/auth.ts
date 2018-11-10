import { GitHubUser, Reducer } from '../../types'

export interface State {
  error: object | null
  isLoggingIn: boolean
  lastLoginAt: string | null
  token: string
  user: GitHubUser | null
}

const initialState: State = {
  error: null,
  isLoggingIn: false,
  lastLoginAt: null,
  token: '',
  user: null,
}

export const authReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        error: null,
        isLoggingIn: true,
        lastLoginAt: state.lastLoginAt,
        token: action.payload.token,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return {
        error: null,
        isLoggingIn: false,
        lastLoginAt: new Date().toISOString(),
        token: state.token,
        user: action.payload,
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
