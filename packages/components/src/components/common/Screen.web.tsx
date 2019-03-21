import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnHeaderThemeColors } from '../columns/ColumnHeader'
import { useTheme } from '../context/ThemeContext'

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
  const { statusBarBackgroundThemeColor } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  useTheme(theme => {
    const themeColor: keyof ThemeColors =
      statusBarBackgroundThemeColor === 'header'
        ? getColumnHeaderThemeColors(theme.backgroundColor).normal
        : statusBarBackgroundThemeColor || 'backgroundColor'

    const color = theme[themeColor]

    const metas = document.getElementsByTagName('meta') as any

    metas['theme-color'].content = color
    metas['msapplication-navbutton-color'].content = color
  })

  return (
    <SpringAnimatedView
      {...props}
      style={[
        styles.container,
        props.style,
        { backgroundColor: springAnimatedTheme.backgroundColor },
      ]}
    />
  )
})
