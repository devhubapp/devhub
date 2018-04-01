import { ComponentClass } from 'react'
import { ViewProperties, ViewStyle } from 'react-native'
import 'react-navigation'

declare module 'react-navigation' {
  export interface TabBarTopProps {
    indicatorStyle: ViewStyle
  }

  export type SafeAreaViewForceInsetValue = 'always' | 'never'

  export interface SafeAreaViewProps extends ViewProperties {
    forceInset?: {
      top?: SafeAreaViewForceInsetValue
      bottom?: SafeAreaViewForceInsetValue
      left?: SafeAreaViewForceInsetValue
      right?: SafeAreaViewForceInsetValue
      horizontal?: SafeAreaViewForceInsetValue
      vertical?: SafeAreaViewForceInsetValue
    }
  }

  export const SafeAreaView: ComponentClass<SafeAreaViewProps>
}
