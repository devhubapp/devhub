import { loadTheme } from '../../../styles/utils'
import { Reducer, ThemePair } from '../../../types'

type State = ThemePair | ''

const initialState: State = ''

export const preferredDarkThemeReducer: Reducer<State> = (
  state = initialState,
  action,
) => {
  switch (action.type) {
    case 'SET_THEME': {
      const theme = loadTheme(action.payload)

      if (theme.isDark && theme.name && theme.name === action.payload.name) {
        return action.payload
      }

      return state
    }

    default:
      return state
  }
}
