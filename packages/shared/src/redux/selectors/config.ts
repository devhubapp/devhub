import { createSelector } from 'reselect'

import { loadTheme } from '../../styles/utils'
import { RootState, ThemePair } from '../../types'
import * as constants from '../../utils/constants'
import { isNight } from '../../utils/helpers/shared'

export const defaultThemePair: ThemePair = {
  id: constants.DEFAULT_THEME,
  color: '',
}

const s = (state: RootState) => state.config || {}

export const themePairSelector = (state: RootState) =>
  s(state).theme || defaultThemePair

export const preferredDarkThemePairSelector = (state: RootState) =>
  s(state).preferredDarkTheme || { id: constants.DEFAULT_DARK_THEME }

export const preferredLightThemePairSelector = (state: RootState) =>
  s(state).preferredLightTheme || { id: constants.DEFAULT_LIGHT_THEME }

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)
