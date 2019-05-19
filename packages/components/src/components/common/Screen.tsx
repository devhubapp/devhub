import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { Theme, ThemeColors } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { useTheme } from '../context/ThemeContext'
import { ThemedSafeAreaView } from '../themed/ThemedSafeAreaView'
import { ThemedView } from '../themed/ThemedView'
import { ConditionalWrap } from './ConditionalWrap'

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header'
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
    ...viewProps
  } = props

  const initialTheme = useTheme(
    useCallback(theme => {
      if (cacheRef.current.theme === theme) return

      cacheRef.current.theme = theme

      updateStyles({
        theme: cacheRef.current.theme,
        statusBarBackgroundThemeColor:
          cacheRef.current.statusBarBackgroundThemeColor,
      })
    }, []),
  )

  const cacheRef = useRef({
    theme: initialTheme,
    statusBarBackgroundThemeColor,
  })
  cacheRef.current.theme = initialTheme
  cacheRef.current.statusBarBackgroundThemeColor = statusBarBackgroundThemeColor

  useEffect(() => {
    if (SplashScreen) {
      SplashScreen.hide()
    }
  }, [])

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
        <ThemedSafeAreaView
          backgroundColor="backgroundColor"
          {...viewProps}
          style={[styles.container, style]}
        />
      ) : (
        <ThemedView
          backgroundColor="backgroundColor"
          {...viewProps}
          style={[styles.container, style]}
        />
      )}
    </ConditionalWrap>
  )
}

function updateStyles({
  theme,
  statusBarBackgroundThemeColor,
}: {
  theme: Theme
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header'
}) {
  StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')

  if (Platform.OS === 'android') {
    const themeColor: keyof ThemeColors =
      statusBarBackgroundThemeColor === 'header'
        ? getColumnHeaderThemeColors(theme.backgroundColor).normal
        : statusBarBackgroundThemeColor || 'backgroundColor'

    const color = theme[themeColor]

    StatusBar.setBackgroundColor(color, false)
  }
}
