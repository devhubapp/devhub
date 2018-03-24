import {
  NavigationRouteConfigMap,
  SwitchNavigator,
  SwitchNavigatorConfig,
} from 'react-navigation'

// import AuthLoadingScreen from '../screens/AuthLoadingScreen'
// import AuthStackNavigator from './AuthStackNavigator'
import MainTabNavigator from './MainTabNavigator'

export const routes: NavigationRouteConfigMap = {
  // Auth: {
  //   path: 'login',
  //   screen: AuthStackNavigator,
  // },
  // AuthLoading: AuthLoadingScreen,
  Main: {
    path: '',
    screen: MainTabNavigator,
  },
}

export const options: SwitchNavigatorConfig = {
  initialRouteName: 'Main',
}

export default SwitchNavigator(routes, options)
