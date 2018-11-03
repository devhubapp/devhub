import { GitHubUser, Reducer } from '../../types'

interface State {
  error: object | null
  isLoggingIn: boolean
  token: string
  user: GitHubUser | null
}

const initialState: State = {
  error: null,
  isLoggingIn: false,
  token: '',
  user: null,
}

export const authReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        error: null,
        isLoggingIn: true,
        token: action.payload.token,
        user: state.user,
      }

    case 'LOGIN_SUCCESS':
      return {
        error: null,
        isLoggingIn: false,
        token: state.token,
        user: action.payload,
      }

    case 'LOGIN_FAILURE':
      return {
        error: action.error,
        isLoggingIn: false,
        token: '',
        user: null,
      }

    default:
      return state
  }
}
