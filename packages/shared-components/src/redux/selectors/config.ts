import { createSelector } from 'reselect'

import { ThemePair } from 'shared-core/dist/types'
import * as constants from 'shared-core/dist/utils/constants'
import { isNight } from 'shared-core/dist/utils/helpers/shared'
import { loadTheme } from '../../styles/utils'
import { RootState } from '../types'

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
