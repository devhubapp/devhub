import React, { ComponentType } from 'react'
import {
  BottomTabBar,
  BottomTabBarProps,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from 'react-navigation-tabs'

import { StyleProp, ViewStyle } from 'react-native'
import Platform from '../libs/platform'
import darkTheme from '../styles/themes/dark'
import { ITheme } from '../types'

// TODO: Use real theme coming from state management library
interface IWithThemeRenderProps {
  theme: ITheme
}

interface IWithThemeProps {
  children: (args: IWithThemeRenderProps) => any
}

const WithTheme = ({ children }: IWithThemeProps) =>
  children({ theme: darkTheme })

type BaseTabBarProps = (BottomTabBarProps | MaterialTopTabBarProps) & {
  indicatorStyle: StyleProp<ViewStyle>
}

const BaseTabBar = Platform.selectUsingRealOS({
  android: MaterialTopTabBar as ComponentType<BaseTabBarProps>,
  default: BottomTabBar as ComponentType<BaseTabBarProps>,
})

const TabBar = (props: BottomTabBarProps) => (
  <WithTheme>
    {({ theme }: IWithThemeRenderProps) => (
      <BaseTabBar
        {...props}
        activeTintColor={theme.brand}
        inactiveTintColor={theme.base05}
        indicatorStyle={{
          backgroundColor: theme.brand,
        }}
        showLabel={Platform.OS === 'ios'}
        showIcon
        style={{
          backgroundColor: theme.tabBarBackground || theme.base02,
          ...Platform.selectUsingRealOS({
            ios: { padding: 3, borderTopColor: theme.base01 },
          }),
        }}
      />
    )}
  </WithTheme>
)

export default TabBar
