import { Reducer, ThemePair } from '../../../types'

type State = ThemePair | null

const initialState: State = null

export const themeReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME': {
      return action.payload
    }

    default:
      return state
  }
}
