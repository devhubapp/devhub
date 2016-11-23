// @flow

import { createRouter } from '@exponent/ex-navigation';

import HomeScreen from '../containers/HomeScreen';
import SettingsScreen from '../containers/SettingsScreen';
import TabsContainer from '../containers/TabsContainer';
// import TabNavigationLayout from '../navigation/TabNavigationLayout';

export default createRouter(() => ({
  home: () => HomeScreen,
  settings: () => SettingsScreen,
  tabs: () => TabsContainer,
}));
