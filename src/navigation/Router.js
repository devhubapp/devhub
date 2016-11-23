// @flow

import { createRouter } from '@exponent/ex-navigation';

import HomeScreen from '../containers/HomeScreen';
import SettingsScreen from '../containers/SettingsScreen';
import ViewScreen from '../containers/ViewScreen';
import TabsContainer from '../containers/TabsContainer';

export default createRouter(() => ({
  app: () => TabsContainer,
  home: () => HomeScreen,
  view: () => ViewScreen,
  settings: () => SettingsScreen,
}));
