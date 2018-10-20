import { combineReducers } from 'redux'

import { Platform } from '../../../libs/platform'
import { preferredDarkThemeReducer } from './preferred-dark-theme'
import { preferredLightThemeReducer } from './preferred-light-theme'
import { themeReducer } from './theme'

export const configReducer = combineReducers({
  [Platform.realOS]: combineReducers({
    preferredDarkTheme: preferredDarkThemeReducer,
    preferredLightTheme: preferredLightThemeReducer,
    theme: themeReducer,
  }),
})
