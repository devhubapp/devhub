import { createSelector } from 'reselect'

import { AppViewMode, constants, isNight } from '@devhub/core'
import { loadTheme } from '../../styles/utils'
import { isBigEnoughForMultiColumnView } from '../../utils/helpers/shared'
import { RootState } from '../types'

const emptyObj = {}

const s = (state: RootState) => state.config || emptyObj

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

export const appViewModeSelector = (state: RootState): AppViewMode => {
  const _appViewMode = constants.DISABLE_SINGLE_COLUMN
    ? 'multi-column'
    : s(state).appViewMode || 'multi-column'

  return isBigEnoughForMultiColumnView() ? _appViewMode : 'single-column'
}
