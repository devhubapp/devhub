import React from 'react'
import { withTheme } from 'styled-components/native'
import { TabNavigator } from 'react-navigation'

import Platform from '../libs/platform'

const _tabBarOptions = Platform.selectUsingRealOS({
  default: TabNavigator.Presets.iOSBottomTabs,
  android: TabNavigator.Presets.AndroidTopTabs,
  ios: TabNavigator.Presets.iOSBottomTabs,
  web: {
    ...TabNavigator.Presets.iOSBottomTabs,
    tabBarPosition: 'top',
  },
})

const BaseTabBar = _tabBarOptions.tabBarComponent
const TabBar = withTheme(({ theme, ...props }) => (
  <BaseTabBar
    {...props}
    activeTintColor={theme.brand}
    inactiveTintColor={theme.base05}
    indicatorStyle={{
      backgroundColor: theme.brand,
    }}
    scrollEnabled={false}
    showLabel={Platform.OS === 'ios'}
    showIcon
    style={{
      backgroundColor: theme.tabBarBackground || theme.base02,
      ...Platform.selectUsingRealOS({
        ios: { padding: 3, borderTopColor: theme.base01 },
      }),
    }}
  />
))

export const tabBarOptions = { ..._tabBarOptions, tabBarComponent: TabBar }
export default TabBar
