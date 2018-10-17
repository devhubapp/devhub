import React, { SFC } from 'react'
import { NavigationScreenProps } from 'react-navigation'

import { Platform } from '../libs/platform'
import { MainScreen } from '../screens/MainScreen.web'

const MainTabNavigatorComponent: SFC<NavigationScreenProps> = props => (
  <MainScreen {...props} />
)

export const MainTabNavigator = Platform.selectUsingRealOS(
  {
    default: () => require('./MainTabNavigator.native').default,
    web: () => MainTabNavigatorComponent,
  },
  { fallbackToWeb: false },
)()
