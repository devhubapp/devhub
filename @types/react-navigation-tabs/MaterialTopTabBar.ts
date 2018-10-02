declare module 'react-navigation-tabs/src/views/MaterialTopTabBar' {
  import React from 'react'
  import { Animated } from 'react-native'

  export interface TabBarOptions {
    activeTintColor?: string
    inactiveTintColor?: string
    showLabel?: boolean
    showIcon?: boolean
    upperCaseLabel?: boolean
    labelStyle?: any
    iconStyle?: any
    allowFontScaling?: boolean
  }

  interface MaterialTopTabBarProps extends TabBarOptions {
    position: Animated.Value
    offsetX: Animated.Value
    panX: Animated.Value
    layout: any
    navigation: any
    renderIcon: (
      props: {
        route: any
        focused: boolean
        tintColor: string
      },
    ) => React.ReactNode
    getLabelText: (props: { route: any }) => any
    getAccessibilityLabel: (props: { route: any }) => string
    getTestID: (props: { route: any }) => string
    useNativeDriver?: boolean
    jumpTo: (key: string) => any
  }

  export class MaterialTopTabBar extends React.Component<
    MaterialTopTabBarProps
  > {}
}
