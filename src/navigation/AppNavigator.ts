import {
  NavigationRouteConfigMap,
  SwitchNavigator,
  SwitchNavigatorConfig,
} from 'react-navigation'

import AuthStackNavigator from './AuthStackNavigator'
import MainTabNavigator from './MainTabNavigator'

export const routes: NavigationRouteConfigMap = {
  Auth: {
    path: '',
    screen: AuthStackNavigator,
  },
  Main: {
    path: '',
    screen: MainTabNavigator,
  },
}

export const options: SwitchNavigatorConfig = {
  initialRouteName: 'Auth',
}

export default SwitchNavigator(routes, options)
