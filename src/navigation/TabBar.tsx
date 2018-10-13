import React, { ComponentType } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import {
  BottomTabBar,
  BottomTabBarProps,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from 'react-navigation-tabs'

import { ThemeConsumer } from '../components/context/ThemeContext'
import Platform from '../libs/platform'
import * as colors from '../styles/colors'

type BaseTabBarProps = (BottomTabBarProps | MaterialTopTabBarProps) & {
  indicatorStyle: StyleProp<ViewStyle>
}

const BaseTabBar = Platform.selectUsingRealOS({
  android: MaterialTopTabBar as ComponentType<BaseTabBarProps>,
  default: BottomTabBar as ComponentType<BaseTabBarProps>,
})

const TabBar = (props: BottomTabBarProps) => (
  <ThemeConsumer>
    {({ theme }) => (
      <BaseTabBar
        {...props}
        activeTintColor={colors.brand}
        inactiveTintColor={theme.foregroundColorMuted50}
        indicatorStyle={{
          backgroundColor: colors.brand,
        }}
        showLabel={Platform.OS === 'ios'}
        showIcon
        style={{
          backgroundColor:
            theme.backgroundColor || theme.backgroundColorTransparent10,
          ...Platform.selectUsingRealOS({
            ios: { padding: 3, borderTopColor: theme.backgroundColor2 },
          }),
        }}
      />
    )}
  </ThemeConsumer>
)

export default TabBar
