// @flow

import { StackNavigator } from 'react-navigation'

import MainTabNavigator from './MainTabNavigator'
import LoginScreen from '../containers/screens/LoginScreen'
import SplashScreen from '../containers/screens/SplashScreen'

export const routes = {
  login: { path: 'login', screen: LoginScreen },
  main: { screen: MainTabNavigator },
  splash: { screen: SplashScreen },
}

export const config = {
  animationEnabled: false,
  headerMode: 'none',
  initialRouteName: 'splash',
  swipeEnabled: false,
}

export default StackNavigator(routes, config)
