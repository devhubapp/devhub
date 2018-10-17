import {
  createSwitchNavigator,
  NavigationRouteConfigMap,
  SwitchNavigatorConfig,
} from 'react-navigation'

import { AuthLoadingScreen } from '../screens/AuthLoadingScreen'
import { AuthStackNavigator } from './AuthStackNavigator'
import { MainTabNavigator } from './MainTabNavigator'

export const routes: NavigationRouteConfigMap = {
  AuthLoading: {
    path: '',
    screen: AuthLoadingScreen,
  },
  Auth: {
    path: '',
    screen: AuthStackNavigator,
  },
  App: {
    path: '',
    screen: MainTabNavigator,
  },
}

export const options: SwitchNavigatorConfig = {
  initialRouteName: 'AuthLoading',
}

export const AppNavigator = createSwitchNavigator(routes, options)
