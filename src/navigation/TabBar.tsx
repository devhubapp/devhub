import React, { ComponentType } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  BottomTabBar,
  BottomTabBarProps,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from 'react-navigation-tabs'

import { ThemeConsumer } from '../components/context/ThemeContext'
import { Platform } from '../libs/platform'

type BaseTabBarProps = (BottomTabBarProps | MaterialTopTabBarProps) & {
  indicatorStyle: StyleProp<ViewStyle>
}

const BaseTabBar = Platform.selectUsingRealOS({
  android: MaterialTopTabBar as ComponentType<BaseTabBarProps>,
  default: BottomTabBar as ComponentType<BaseTabBarProps>,
})

export const TabBar = (props: BottomTabBarProps) => (
  <ThemeConsumer>
    {({ theme }) => (
      <BaseTabBar
        {...props}
        activeTintColor={theme.foregroundColor}
        inactiveTintColor={theme.foregroundColorMuted50}
        indicatorStyle={{
          backgroundColor: theme.foregroundColor,
        }}
        showLabel={Platform.realOS === 'ios'}
        showIcon
        style={{
          backgroundColor: theme.backgroundColor,
          ...Platform.selectUsingRealOS({
            ios: { padding: 3, borderTopColor: theme.backgroundColorDarker08 },
          }),
        }}
      />
    )}
  </ThemeConsumer>
)
