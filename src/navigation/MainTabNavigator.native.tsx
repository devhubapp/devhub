import React from 'react'
import Octicons from 'react-native-vector-icons/Octicons'
import {
  NavigationRouteConfigMap,
  NavigationStackScreenOptions,
  StackNavigator,
  TabNavigator,
  TabNavigatorConfig,
} from 'react-navigation'

import Platform from '../libs/platform'
import FeedScreen from '../screens/FeedScreen'
import NotificationsScreen from '../screens/NotificationsScreen'
import SettingsScreen from '../screens/SettingsScreen'
import theme from '../styles/themes/dark'
import { IGitHubIcon } from '../types'
import TabBar from './TabBar'

const navigationOptions: NavigationStackScreenOptions = {
  headerStyle: {
    backgroundColor: theme.base00,
    borderBottomColor: theme.base01,
  },
  headerTintColor: theme.base04,
}

export const routes: NavigationRouteConfigMap = {
  Feed: {
    path: '',
    screen: StackNavigator({ FeedScreen }, { navigationOptions }),
  },
  Notifications: {
    path: 'notifications',
    screen: StackNavigator({ NotificationsScreen }, { navigationOptions }),
  },
  Settings: {
    path: 'settings',
    screen: StackNavigator({ SettingsScreen }, { navigationOptions }),
  },
}

export const options: TabNavigatorConfig = {
  animationEnabled: Platform.realOS === 'android',
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state

      const iconName = ((): IGitHubIcon => {
        switch (routeName) {
          case 'Feed':
            return 'home'

          case 'Notifications':
            return 'globe'

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

export default TabNavigator(routes, options)
