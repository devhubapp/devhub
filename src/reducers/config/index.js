// @flow

import { combineReducers } from 'redux-immutable'

import Platform from '../../libs/platform'
import preferredDarkTheme from './preferred-dark-theme'
import preferredLightTheme from './preferred-light-theme'
import theme from './theme'

export default combineReducers({
  [Platform.realOS]: combineReducers({
    preferredDarkTheme,
    preferredLightTheme,
    theme,
  }),
})
