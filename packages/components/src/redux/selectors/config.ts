import { createSelector } from 'reselect'

import { AppViewMode, constants, isNight } from '@devhub/core'
import { loadTheme } from '../../styles/utils'
import { RootState } from '../types'

const s = (state: RootState) => state.config || {}

export const themePairSelector = (state: RootState) =>
  s(state).theme || constants.DEFAULT_THEME_PAIR

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

export const viewModeSelector = (state: RootState) =>
  'single-column' as AppViewMode
// s(state).appViewMode || 'multi-column'
