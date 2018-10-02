declare module 'react-navigation-tabs' {
  import './BottomTabBar'
  import './MaterialTopTabBar'

  import {
    BottomTabBar,
    BottomTabBarProps,
  } from 'react-navigation-tabs/src/views/BottomTabBar'
  import {
    MaterialTopTabBar,
    MaterialTopTabBarProps,
  } from 'react-navigation-tabs/src/views/MaterialTopTabBar'

  /**
   * Navigators
   */
  // export type createBottomTabNavigator = any
  // export type createMaterialTopTabNavigator = any

  /**
   * Views
   */
  export { BottomTabBar, BottomTabBarProps }
  export { MaterialTopTabBar, MaterialTopTabBarProps }

  /**
   * Utils
   */
  export function createTabNavigator(routes: any, config?: object): any
}
