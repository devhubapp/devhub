declare module 'react-navigation-tabs/src/views/BottomTabBar' {
  import React from 'react'

  export interface TabBarOptions {
    activeTintColor?: string
    inactiveTintColor?: string
    activeBackgroundColor?: string
    inactiveBackgroundColor?: string
    allowFontScaling: boolean
    showLabel: boolean
    showIcon: boolean
    labelStyle: any
    tabStyle: any
    adaptive?: boolean
    style: any
  }

  export interface BottomTabBarProps extends TabBarOptions {
    navigation: any
    descriptors: any
    jumpTo: any
    onTabPress: any
    getAccessibilityLabel: (props: { route: any }) => string
    getButtonComponent: (props: { route: any }) => any
    getLabelText: (props: { route: any }) => any
    getTestID: (props: { route: any }) => string
    renderIcon: any
    dimensions: { width: number; height: number }
    isLandscape: boolean
    safeAreaInset: { top: string; right: string; bottom: string; left: string }
  }

  export class BottomTabBar extends React.Component<BottomTabBarProps> {}
}
