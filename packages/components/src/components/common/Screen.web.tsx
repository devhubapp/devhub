// import { darken } from 'polished'
import React, { ReactNode } from 'react'
import { Animated, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'

export interface ScreenProps {
  children?: ReactNode
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})

export const Screen = React.memo((props: ScreenProps) => {
  const animatedTheme = useAnimatedTheme()

  return (
    <Animated.View
      {...props}
      style={[
        styles.container,
        props.style,
        { backgroundColor: animatedTheme.backgroundColor },
        // darken(0.01, theme.backgroundColor)
      ]}
    />
  )
})
