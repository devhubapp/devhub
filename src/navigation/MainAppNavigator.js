// @flow

import TabBar from '../components/TabBar';
import HomeScreen from '../containers/screens/HomeScreen';
import NotificationsScreen from '../containers/screens/NotificationsScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';
import { TabNavigator } from '../libs/navigation';

export const routes = {
  Home: { path: '', screen: HomeScreen },
  Notifications: { path: 'notifications', screen: NotificationsScreen },
  Settings: { path: 'settings', screen: SettingsScreen },
};

export const options = { swipeEnabled: false, tabBarComponent: TabBar };

export default TabNavigator(routes, options);
