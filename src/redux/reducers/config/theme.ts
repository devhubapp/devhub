import { Reducer, ThemePair } from '../../../types'

type State = ThemePair | ''

const initialState: State = ''

export const themeReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME': {
      return action.payload
    }

    default:
      return state
  }
}
