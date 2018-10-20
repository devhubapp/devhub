import { createSelector } from 'reselect'

import { Platform } from '../../libs/platform'
import { loadTheme } from '../../styles/utils'
import { isNight } from '../../utils/helpers/shared'

export const themePairSelector = (state: any) =>
  state.config[Platform.realOS].theme

export const preferredDarkThemePairSelector = (state: any) =>
  state.config[Platform.realOS].preferredDarkTheme

export const preferredLightThemePairSelector = (state: any) =>
  state.config[Platform.realOS].preferredLightTheme

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)
