// @flow

import HomeScreen from '../containers/screens/HomeScreen';
import NotificationsScreen from '../containers/screens/NotificationsScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';
import { tabBarOptions } from '../components/TabBar';
import { TabNavigator } from '../libs/navigation';

export const routes = {
  Home: { path: '', screen: HomeScreen },
  Notifications: { path: 'notifications', screen: NotificationsScreen },
  Settings: { path: 'settings', screen: SettingsScreen },
};

export const config = { ...tabBarOptions, swipeEnabled: false };

export default TabNavigator(routes, config);
