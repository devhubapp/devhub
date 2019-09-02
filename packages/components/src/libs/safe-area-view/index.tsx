import React from 'react'
import { View, ViewProps } from 'react-native'
import {
  SafeAreaConsumer,
  SafeAreaContext,
  SafeAreaProvider,
  useSafeArea,
} from 'react-native-safe-area-context'

export { SafeAreaConsumer, SafeAreaContext, SafeAreaProvider, useSafeArea }

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
