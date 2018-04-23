import React, { SFC } from 'react'
import { NavigationScreenProps } from 'react-navigation'

import Platform from '../libs/platform'
import MainScreen from '../screens/MainScreen.web'

const MainTabNavigator: SFC<NavigationScreenProps> = props => (
  <MainScreen {...props} />
)

export default Platform.selectUsingRealOS(
  {
    default: () => require('./MainTabNavigator.native').default,
    web: () => MainTabNavigator,
  },
  { fallbackToWeb: false },
)()
