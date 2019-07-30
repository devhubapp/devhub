import { createSelector } from 'reselect'

import { constants, isNight } from '@devhub/core'
import { loadTheme } from '../../styles/utils'
import { EMPTY_OBJ } from '../../utils/constants'
import { isBigEnoughForMultiColumnView } from '../../utils/helpers/shared'
import { RootState } from '../types'

const s = (state: RootState) => state.config || EMPTY_OBJ

export const themePairSelector = (state: RootState) =>
  s(state).theme || constants.DEFAULT_THEME_PAIR

const defaultPreferredDarkThemePair = { id: constants.DEFAULT_DARK_THEME }
export const preferredDarkThemePairSelector = (state: RootState) =>
  s(state).preferredDarkTheme || defaultPreferredDarkThemePair

const defaultPreferredLightThemePair = { id: constants.DEFAULT_LIGHT_THEME }
export const preferredLightThemePairSelector = (state: RootState) =>
  s(state).preferredLightTheme || defaultPreferredLightThemePair

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)

export const appViewModeSelector = (state: RootState) => {
  const _appViewMode = constants.DISABLE_SINGLE_COLUMN
    ? 'multi-column'
    : s(state).appViewMode || 'multi-column'

  return isBigEnoughForMultiColumnView() ? _appViewMode : 'single-column'
}
