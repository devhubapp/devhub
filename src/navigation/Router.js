// @flow

import { createRouter } from '@exponent/ex-navigation';

// screens
import HomeScreen from '../containers/screens/HomeScreen';
import LoginScreen from '../containers/screens/LoginScreen';
import MainTabbedScreen from '../containers/screens/MainTabbedScreen';
import NotificationsScreen from '../containers/screens/NotificationsScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';
import SplashScreen from '../containers/screens/SplashScreen';
import ViewScreen from '../containers/screens/ViewScreen';

export default createRouter(() => ({
  // public screens
  login: () => LoginScreen,
  splash: () => SplashScreen,

  // private tab page
  main: () => MainTabbedScreen,

  // private screens
  home: () => HomeScreen,
  notifications: () => NotificationsScreen,
  settings: () => SettingsScreen,

  // placeholder
  empty: () => ViewScreen,
}));
