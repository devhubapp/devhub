import React, { ReactNode, useLayoutEffect, useRef } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { useTheme } from '../context/ThemeContext'
import { ThemedSafeAreaView } from '../themed/ThemedSafeAreaView'
import { ThemedView } from '../themed/ThemedView'

export interface ScreenProps {
  children?: ReactNode
  enableSafeArea?: boolean
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header' | 'transparent'
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export const Screen = React.memo((props: ScreenProps) => {
  const {
    enableSafeArea = true,
    statusBarBackgroundThemeColor,
    style,
    ...viewProps
  } = props

  const ref = useRef<View>(null)

  const theme = useTheme()

  useLayoutEffect(() => {
    updateStyles({
      statusBarBackgroundThemeColor,
      theme,
    })
  }, [statusBarBackgroundThemeColor, theme])

  return enableSafeArea ? (
    <ThemedSafeAreaView
      ref={ref}
      backgroundColor="backgroundColor"
      {...viewProps}
      style={[styles.container, style]}
    />
  ) : (
    <ThemedView
      ref={ref}
      backgroundColor="backgroundColor"
      {...viewProps}
      style={[styles.container, style]}
    />
  )
})

Screen.displayName = 'Screen'

function updateStyles({
  theme,
  statusBarBackgroundThemeColor,
}: {
  theme: Theme
  statusBarBackgroundThemeColor?: ScreenProps['statusBarBackgroundThemeColor']
}) {
  const themeColor: keyof ThemeColors =
    statusBarBackgroundThemeColor === 'header' ||
    statusBarBackgroundThemeColor === 'transparent'
      ? getColumnHeaderThemeColors().normal
      : statusBarBackgroundThemeColor || 'backgroundColor'

  const color = theme[themeColor]

  const metas = document.getElementsByTagName('meta') as any

  metas['theme-color'].content = color
  metas['msapplication-navbutton-color'].content = color
}
