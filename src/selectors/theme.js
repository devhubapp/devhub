// @flow
/*  eslint-disable import/prefer-default-export */

import { createSelector } from 'reselect'

import Platform from '../libs/platform'
import { isNight, loadTheme } from '../utils/helpers'

export const themeNameSelector = state =>
  state.getIn(['config', Platform.realOS, 'theme'])

export const preferredDarkThemeNameSelector = state =>
  state.getIn(['config', Platform.realOS, 'preferredDarkTheme'])

export const preferredLightThemeNameSelector = state =>
  state.getIn(['config', Platform.realOS, 'preferredLightTheme'])

export const themeSelector = createSelector(
  themeNameSelector,
  preferredDarkThemeNameSelector,
  preferredLightThemeNameSelector,
  isNight,
  loadTheme,
)
