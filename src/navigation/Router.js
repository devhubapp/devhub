// @flow

import { createRouter } from '@exponent/ex-navigation';

import HomeScreen from '../containers/screens/HomeScreen';
import LoginScreen from '../containers/screens/LoginScreen';
import SplashScreen from '../containers/screens/SplashScreen';
import MainScreen from '../containers/screens/MainScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';
import ViewScreen from '../containers/screens/ViewScreen';

export default createRouter(() => ({
  // public screens
  login: () => LoginScreen,
  splash: () => SplashScreen,

  // private tab page
  main: () => MainScreen,

  // private screens
  home: () => HomeScreen,
  settings: () => SettingsScreen,

  // placeholder
  empty: () => ViewScreen,
}));
