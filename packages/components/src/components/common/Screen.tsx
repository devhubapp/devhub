import { Theme, ThemeColors } from '@devhub/core'
import React, { ReactNode, useEffect, useLayoutEffect } from 'react'
import {
  KeyboardAvoidingView,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { Platform } from '../../libs/platform'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { ThemedSafeAreaView } from '../themed/ThemedSafeAreaView'
import { ThemedView } from '../themed/ThemedView'
import { ConditionalWrap } from './ConditionalWrap'

export interface ScreenProps {
  children?: ReactNode
  enableSafeArea?: boolean
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header' | 'transparent'
  style?: StyleProp<ViewStyle>
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
    enableSafeArea = true,
    statusBarBackgroundThemeColor,
    style,
    ...viewProps
  } = props

  const theme = useTheme()

  useLayoutEffect(() => {
    updateStyles({
      statusBarBackgroundThemeColor,
      theme,
    })
  }, [statusBarBackgroundThemeColor, theme])

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
      {enableSafeArea ? (
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
  statusBarBackgroundThemeColor?: ScreenProps['statusBarBackgroundThemeColor']
}) {
  StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')

  if (Platform.OS === 'android') {
    const themeColor: keyof ThemeColors | 'transparent' =
      statusBarBackgroundThemeColor === 'header'
        ? getColumnHeaderThemeColors().normal
        : statusBarBackgroundThemeColor || 'backgroundColor'

    const color = getThemeColorOrItself(theme, themeColor, {
      enableCSSVariable: false,
    })!

    StatusBar.setBackgroundColor(color, false)
    StatusBar.setTranslucent(color === 'transparent')
  }
}
