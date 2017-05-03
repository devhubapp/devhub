// @flow

import HomeScreen from '../containers/screens/HomeScreen'
import NotificationsScreen from '../containers/screens/NotificationsScreen'
import SettingsScreen from '../containers/screens/SettingsScreen'
import { TabNavigator } from '../libs/navigation'
import { tabBarOptions } from '../components/TabBar'

export const routes = {
  home: { path: '', screen: HomeScreen },
  notifications: { path: 'notifications', screen: NotificationsScreen },
  settings: { path: 'settings', screen: SettingsScreen },
}

export const config = { ...tabBarOptions, swipeEnabled: false }

export default TabNavigator(routes, config)
