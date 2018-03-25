import {
  NavigationRouteConfigMap,
  StackNavigator,
  StackNavigatorConfig,
} from 'react-navigation'

import LoginScreen from '../screens/LoginScreen'

export const routes: NavigationRouteConfigMap = {
  Login: {
    path: 'login',
    screen: LoginScreen,
  },
}

export const options: StackNavigatorConfig = {}

export default StackNavigator(routes, options)
