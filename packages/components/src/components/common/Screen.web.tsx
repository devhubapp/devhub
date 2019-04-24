import React, { ReactNode, useCallback, useRef } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { useTheme } from '../context/ThemeContext'
import { ThemedView } from '../themed/ThemedView'

export interface ScreenProps {
  children?: ReactNode
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header'
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export const Screen = React.memo((props: ScreenProps) => {
  const { statusBarBackgroundThemeColor, ...viewProps } = props

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

  return (
    <ThemedView
      {...viewProps}
      backgroundColor="backgroundColor"
      style={[styles.container, props.style]}
    />
  )
})

function updateStyles({
  theme,
  statusBarBackgroundThemeColor,
}: {
  theme: Theme
  statusBarBackgroundThemeColor?: keyof ThemeColors | 'header'
}) {
  const themeColor: keyof ThemeColors =
    statusBarBackgroundThemeColor === 'header'
      ? getColumnHeaderThemeColors(theme.backgroundColor).normal
      : statusBarBackgroundThemeColor || 'backgroundColor'

  const color = theme[themeColor]

  const metas = document.getElementsByTagName('meta') as any

  metas['theme-color'].content = color
  metas['msapplication-navbutton-color'].content = color
}
