import { createSelector } from 'reselect'

import {
  AppViewMode,
  constants,
  isNight,
  loadTheme,
  ThemePair,
} from '@devhub/core'
import { EMPTY_OBJ } from '../../utils/constants'
import { isBigEnoughForMultiColumnView } from '../../utils/helpers/shared'
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

export const appViewModeSelector = (state: RootState): AppViewMode => {
  const _appViewMode = constants.DISABLE_SINGLE_COLUMN
    ? 'multi-column'
    : s(state).appViewMode || 'multi-column'

  return isBigEnoughForMultiColumnView() ? _appViewMode : 'single-column'
}
