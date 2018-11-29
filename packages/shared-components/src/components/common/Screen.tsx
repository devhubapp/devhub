import { darken } from 'polished'
import React, { ReactNode, useEffect } from 'react'
import {
  SafeAreaView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { useTheme } from '../context/ThemeContext'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundColor?: string
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

  useEffect(() => {
    if (isSplashScreenVisible && SplashScreen) {
      SplashScreen.hide()
      isSplashScreenVisible = false
    }
  }, [])

  const { statusBarBackgroundColor, useSafeArea = true, ...otherProps } = props

  const style = { backgroundColor: darken(0.01, theme.backgroundColor) }

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={statusBarBackgroundColor || theme.backgroundColor}
      />

      <View style={{ flex: 1, backgroundColor: 'red' }}>
        {useSafeArea ? (
          <SafeAreaView {...otherProps} style={[styles.container, style]} />
        ) : (
          <View {...otherProps} style={[styles.container, style]} />
        )}
      </View>
    </>
  )
}
