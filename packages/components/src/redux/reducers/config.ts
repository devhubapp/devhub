import immer from 'immer'
import _ from 'lodash'

import { ThemePair } from '@devhub/core/src/types'
import {
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
} from '@devhub/core/src/utils/constants'
import { loadTheme } from '../../styles/utils'
import { Reducer } from '../types'

export interface State {
  preferredDarkTheme?: ThemePair
  preferredLightTheme?: ThemePair
  theme?: ThemePair
}

const initialState: State = {
  preferredDarkTheme: { id: DEFAULT_DARK_THEME },
  preferredLightTheme: { id: DEFAULT_LIGHT_THEME },
  theme: { id: 'auto' },
}

export const configReducer: Reducer<State> = (state = initialState, action) => {
  switch (action.type) {
    case 'DAY_NIGHT_SWITCH':
      return { ...state }

    case 'SET_THEME':
      return immer(state, draft => {
        const theme = loadTheme(action.payload)

        if (theme.id && theme.id === action.payload.id) {
          if (theme.isDark) draft.preferredDarkTheme = action.payload
          else draft.preferredLightTheme = action.payload
        }

        draft.theme = action.payload
      })

    case 'SET_PREFERRABLE_THEME':
      return immer(state, draft => {
        const theme = loadTheme(action.payload)

        if (theme.isDark) draft.preferredDarkTheme = action.payload
        else draft.preferredLightTheme = action.payload

        if (state.theme && state.theme.id !== 'auto')
          draft.theme = action.payload
      })

    default:
      return state
  }
}
