import {
  createStackNavigator,
  NavigationRouteConfigMap,
  StackNavigatorConfig,
} from 'react-navigation'

import { MainScreen } from '../screens/MainScreen'

export const routes: NavigationRouteConfigMap = {
  Main: {
    path: '',
    screen: MainScreen,
  },
}

export const options: StackNavigatorConfig = {}

export const MainNavigator = createStackNavigator(routes, options)
