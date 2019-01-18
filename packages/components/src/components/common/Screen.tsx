import React, { ReactNode, useEffect } from 'react'
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
import { SpringAnimatedStatusBar } from '../animated/spring/SpringAnimatedStatusBar'
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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  useTheme(theme => {
    StatusBar.setBarStyle(theme.isDark ? 'light-content' : 'dark-content')
  })

  useEffect(() => {
    if (SplashScreen) {
      SplashScreen.hide()
    }
  }, [])

  const {
    statusBarBackgroundThemeColor,
    useSafeArea = true,
    style,
    ...otherProps
  } = props

  return (
    <>
      <SpringAnimatedStatusBar
        barStyle="light-content"
        backgroundColor={
          statusBarBackgroundThemeColor
            ? springAnimatedTheme[statusBarBackgroundThemeColor]
            : springAnimatedTheme.backgroundColor
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
          <SpringAnimatedSafeAreaView
            {...otherProps}
            style={[
              styles.container,
              { backgroundColor: springAnimatedTheme.backgroundColor as any },
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
    </>
  )
}
