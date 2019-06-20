import { Reducer } from '../types'

export interface State {
  loginSuccess: number
}

const initialState: State = {
  loginSuccess: 0,
}

export const countReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        loginSuccess: (state.loginSuccess || 0) + 1,
      }

    default:
      return state
  }
}
