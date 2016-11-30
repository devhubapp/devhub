// @flow

import { createRouter } from '@exponent/ex-navigation';

import HomeScreen from '../containers/screens/HomeScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';
import ViewScreen from '../containers/screens/ViewScreen';
import TabsContainer from '../containers/TabsContainer';

export default createRouter(() => ({
  app: () => TabsContainer,
  home: () => HomeScreen,
  view: () => ViewScreen,
  settings: () => SettingsScreen,
}));
