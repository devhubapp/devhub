import React from 'react'
import { View, ViewProps } from 'react-native'
import {
  SafeAreaConsumer,
  SafeAreaContext,
  SafeAreaProvider,
  useSafeArea as useSafeAreaOriginal,
} from 'react-native-safe-area-context'
import { getElectronTitleBarHeight } from '../../components/ElectronTitleBar'
import { useDesktopOptions } from '../../hooks/use-desktop-options'

export { SafeAreaConsumer, SafeAreaContext, SafeAreaProvider }

export const useSafeArea: typeof useSafeAreaOriginal = () => {
  const safeAreaInsets = useSafeAreaOriginal()
  const { isMenuBarMode } = useDesktopOptions()

  return {
    top: safeAreaInsets.top + getElectronTitleBarHeight({ isMenuBarMode }),
    bottom: safeAreaInsets.bottom,
    left: safeAreaInsets.left,
    right: safeAreaInsets.right,
  }
}

export const SafeAreaView = React.forwardRef<View, ViewProps>((props, ref) => {
  const safeAreaInsets = useSafeArea()

  return (
    <View
      ref={ref}
      {...props}
      style={[
        {
          paddingTop: safeAreaInsets.top,
          paddingBottom: safeAreaInsets.bottom,
          paddingLeft: safeAreaInsets.left,
          paddingRight: safeAreaInsets.right,
        },
        props.style,
      ]}
    />
  )
})

export type SafeAreaView = View
