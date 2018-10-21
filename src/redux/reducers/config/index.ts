import { combineReducers } from 'redux'

import { preferredDarkThemeReducer } from './preferred-dark-theme'
import { preferredLightThemeReducer } from './preferred-light-theme'
import { themeReducer } from './theme'

export const configReducer = combineReducers({
  preferredDarkTheme: preferredDarkThemeReducer,
  preferredLightTheme: preferredLightThemeReducer,
  theme: themeReducer,
})
