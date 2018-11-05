import {
  createStackNavigator,
  NavigationRouteConfigMap,
  StackNavigatorConfig,
} from 'react-navigation'

import { MainScreen } from '../screens/MainScreen'
import { SettingsScreen } from '../screens/SettingsScreen'

export const routes: NavigationRouteConfigMap = {
  Main: {
    path: '',
    screen: MainScreen,
  },
  Settings: {
    path: 'settings',
    screen: SettingsScreen,
  },
}

export const options: StackNavigatorConfig = {}

export const MainNavigator = createStackNavigator(routes, options)
