import React, { ReactNode, useEffect, useRef } from 'react'
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'
import { ConditionalWrap } from './ConditionalWrap'

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundThemeColor?: keyof ThemeColors
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
  const {
    statusBarBackgroundThemeColor,
    useSafeArea = true,
    style,
    ...otherProps
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const initialTheme = useTheme(theme => {
    cacheRef.current.theme = theme
    updateStyles()
  })

  const cacheRef = useRef({ theme: initialTheme })

  useEffect(() => {
    if (SplashScreen) {
      SplashScreen.hide()
    }
  }, [])

  function updateStyles() {
    const { theme } = cacheRef.current

    StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(
        statusBarBackgroundThemeColor
          ? theme[statusBarBackgroundThemeColor]
          : theme.backgroundColor,
        false,
      )
    }
  }

  return (
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
        <SpringAnimatedSafeAreaView
          {...otherProps}
          style={[
            styles.container,
            { backgroundColor: springAnimatedTheme.backgroundColor },
            style,
          ]}
        />
      ) : (
        <SpringAnimatedView
          {...otherProps}
          style={[
            styles.container,
            { backgroundColor: springAnimatedTheme.backgroundColor },
            style,
          ]}
        />
      )}
    </ConditionalWrap>
  )
}
