import React, { SFC } from 'react'
import { NavigationScreenProps } from 'react-navigation'

import MainScreen from '../screens/MainScreen.web'

const MainTabNavigator: SFC<NavigationScreenProps> = props => (
  <MainScreen {...props} />
)

export default MainTabNavigator
