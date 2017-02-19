// @flow

import { TabNavigator } from 'react-navigation';

import TabBar from '../components/TabBar';
import HomeScreen from '../containers/screens/HomeScreen';
import NotificationsScreen from '../containers/screens/NotificationsScreen';
import SettingsScreen from '../containers/screens/SettingsScreen';

export default TabNavigator(
  {
    Home: { path: '', screen: HomeScreen },
    Notifications: { path: 'notifications', screen: NotificationsScreen },
    Settings: { path: 'settings', screen: SettingsScreen },
  },
  {
    swipeEnabled: false,
    tabBarComponent: TabBar,
  },
);
