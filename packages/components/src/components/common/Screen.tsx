// import { darken } from 'polished'
import React, { ReactNode, useEffect } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { AnimatedSafeAreaView } from '../../components/animated/AnimatedSafeAreaView'
import { AnimatedStatusBar } from '../../components/animated/AnimatedStatusBar'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useTheme } from '../context/ThemeContext'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundColor?: string | Animated.AnimatedInterpolation
  style?: StyleProp<ViewStyle>
  useSafeArea?: boolean
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
})

export function Screen(props: ScreenProps) {
  const theme = useTheme()
  const animatedTheme = useAnimatedTheme()

  useEffect(() => {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }, [])

  const { statusBarBackgroundColor, useSafeArea = true, ...otherProps } = props

  // const style = { backgroundColor: darken(0.01, theme.backgroundColor) }
  const style = { backgroundColor: theme.backgroundColor }

  return (
    <>
      <AnimatedStatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          statusBarBackgroundColor || animatedTheme.backgroundColor
        }
      />

      <View style={{ flex: 1 }}>
        {useSafeArea ? (
          <AnimatedSafeAreaView
            {...otherProps}
            style={[styles.container, style]}
          />
        ) : (
          <Animated.View {...otherProps} style={[styles.container, style]} />
        )}
      </View>
    </>
  )
}
