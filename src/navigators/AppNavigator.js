// @flow

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../containers/screens/LoginScreen';
import SplashScreen from '../containers/screens/SplashScreen';
import { StackNavigator } from '../libs/navigation';

export const routes = {
  login: { path: 'login', screen: LoginScreen },
  main: { screen: MainTabNavigator },
  splash: { screen: SplashScreen },
};

export const config = {
  headerMode: 'none',
  initialRouteName: 'splash',
};

export default StackNavigator(routes, config);
