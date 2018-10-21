import { createSelector } from 'reselect'

import { loadTheme } from '../../styles/utils'
import { isNight } from '../../utils/helpers/shared'

export const themePairSelector = (state: any) => state.config.theme

export const preferredDarkThemePairSelector = (state: any) =>
  state.config.preferredDarkTheme

export const preferredLightThemePairSelector = (state: any) =>
  state.config.preferredLightTheme

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)
