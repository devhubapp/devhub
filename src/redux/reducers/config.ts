import immer from 'immer'

import { loadTheme } from '../../styles/utils'
import { Reducer, ThemePair } from '../../types'

interface State {
  preferredDarkTheme?: ThemePair
  preferredLightTheme?: ThemePair
  theme?: ThemePair
}

const initialState: State = {}

export const configReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return immer(state, draft => {
        const theme = loadTheme(action.payload)

        if (theme.id && theme.id === action.payload.id) {
          if (theme.isDark) draft.preferredDarkTheme = action.payload
          else draft.preferredLightTheme = action.payload
        }

        draft.theme = action.payload
      })

    default:
      return state
  }
}
