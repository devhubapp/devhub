// import { darken } from 'polished'
import React, { ReactNode, useEffect } from 'react'
import {
  Animated,
  KeyboardAvoidingView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { AnimatedSafeAreaView } from '../../components/animated/AnimatedSafeAreaView'
import { AnimatedStatusBar } from '../../components/animated/AnimatedStatusBar'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { Platform } from '../../libs/platform'
import { useTheme } from '../context/ThemeContext'
import { ConditionalWrap } from './ConditionalWrap'

let isSplashScreenVisible = true

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundColor?: string | Animated.AnimatedInterpolation
  style?: StyleProp<ViewStyle>
  useSafeArea?: boolean
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
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

  const {
    statusBarBackgroundColor,
    useSafeArea = true,
    style,
    ...otherProps
  } = props

  return (
    <>
      <AnimatedStatusBar
        animated
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={
          statusBarBackgroundColor || (animatedTheme.backgroundColor as any)
        }
      />

      <ConditionalWrap
        condition
        wrap={children =>
          Platform.select({
            ios: (
              <KeyboardAvoidingView behavior="padding" style={styles.wrapper}>
                {children}
              </KeyboardAvoidingView>
            ),
            default: <View style={styles.wrapper}>{children}</View>,
          })
        }
      >
        {useSafeArea ? (
          <AnimatedSafeAreaView
            {...otherProps}
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColor },
              style,
            ]}
          />
        ) : (
          <Animated.View
            {...otherProps}
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColor },
              style,
            ]}
          />
        )}
      </ConditionalWrap>
    </>
  )
}
