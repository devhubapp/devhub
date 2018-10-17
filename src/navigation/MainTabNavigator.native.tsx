import React from 'react'
import Octicons from 'react-native-vector-icons/Octicons'
import {
  createBottomTabNavigator,
  createStackNavigator,
  NavigationRouteConfigMap,
  TabNavigatorConfig,
} from 'react-navigation'

import { Platform } from '../libs/platform'
import { FeedScreen } from '../screens/FeedScreen'
import { NotificationsScreen } from '../screens/NotificationsScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { GithubIcon } from '../types'
import { TabBar } from './TabBar'

const navigationOptions = {
  header: null,
}

export const routes: NavigationRouteConfigMap = {
  Feed: {
    path: '',
    screen: createStackNavigator({ FeedScreen }, { navigationOptions }),
  },
  Notifications: {
    path: 'notifications',
    screen: createStackNavigator(
      { NotificationsScreen },
      { navigationOptions },
    ),
  },
  Settings: {
    path: 'settings',
    screen: createStackNavigator({ SettingsScreen }, { navigationOptions }),
  },
}

export const options: TabNavigatorConfig = {
  animationEnabled: Platform.realOS === 'android',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state

      const iconName = ((): GithubIcon => {
        switch (routeName) {
          case 'Feed':
            return 'home'

          case 'Notifications':
            return 'bell'

          case 'Settings':
            return 'gear'

          default:
            return 'octoface'
        }
      })()

      return (
        <Octicons name={iconName} size={25} color={tintColor || undefined} />
      )
    },
  }),
  swipeEnabled: false,
  tabBarComponent: Platform.realOS === 'web' ? undefined : TabBar,
  tabBarPosition: Platform.selectUsingRealOS({
    default: 'top',
    ios: 'bottom',
  }) as 'top' | 'bottom',
}

export const MainTabNavigator = createBottomTabNavigator(routes, options)
