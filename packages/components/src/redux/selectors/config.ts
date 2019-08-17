import { createSelector } from 'reselect'

import { constants, isNight, loadTheme, ThemePair } from '@devhub/core'
import { EMPTY_OBJ } from '../../utils/constants'
import { RootState } from '../types'

const s = (state: RootState) => state.config || EMPTY_OBJ

export const themePairSelector = (state: RootState) =>
  s(state).theme || constants.DEFAULT_THEME_PAIR

const defaultPreferredDarkThemePair: ThemePair = {
  id: constants.DEFAULT_DARK_THEME,
}
export const preferredDarkThemePairSelector = (state: RootState) =>
  s(state).preferredDarkTheme || defaultPreferredDarkThemePair

const defaultPreferredLightThemePair: ThemePair = {
  id: constants.DEFAULT_LIGHT_THEME,
}
export const preferredLightThemePairSelector = (state: RootState) =>
  s(state).preferredLightTheme || defaultPreferredLightThemePair

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)
