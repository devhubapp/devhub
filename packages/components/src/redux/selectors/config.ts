import { createSelector } from 'reselect'

import { constants, isNight } from '@devhub/core'
import { Dimensions } from 'react-native'
import { APP_LAYOUT_BREAKPOINTS } from '../../components/context/LayoutContext'
import { loadTheme } from '../../styles/utils'
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

// Do not use this directly. Use useAppViewMode() instead.
export const _appViewModeSelector = (state: RootState) => {
  if (constants.DISABLE_SINGLE_COLUMN) return 'multi-column'

  const isBigEnoughForMultiColumnView =
    Dimensions.get('window').width >= APP_LAYOUT_BREAKPOINTS.MEDIUM

  return isBigEnoughForMultiColumnView
    ? s(state).appViewMode || 'multi-column'
    : 'single-column'
}
