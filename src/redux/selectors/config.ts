import { createSelector } from 'reselect'

import { loadTheme } from '../../styles/utils'
import { RootState } from '../../types'
import { isNight } from '../../utils/helpers/shared'

const s = (state: RootState) => state.config || {}

export const themePairSelector = (state: RootState) => s(state).theme

export const preferredDarkThemePairSelector = (state: RootState) =>
  s(state).preferredDarkTheme

export const preferredLightThemePairSelector = (state: RootState) =>
  s(state).preferredLightTheme

export const themeSelector = createSelector(
  themePairSelector,
  preferredDarkThemePairSelector,
  preferredLightThemePairSelector,
  isNight,
  loadTheme,
)
