import {
  createStackNavigator,
  NavigationRouteConfigMap,
  StackNavigatorConfig,
} from 'react-navigation'

import { LoginScreen } from '../screens/LoginScreen'

export const routes: NavigationRouteConfigMap = {
  Login: {
    path: 'login',
    screen: LoginScreen,
  },
}

export const options: StackNavigatorConfig = {}

export const AuthStackNavigator = createStackNavigator(routes, options)
