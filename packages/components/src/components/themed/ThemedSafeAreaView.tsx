import React from 'react'
import { StyleProp, TextProps, TextStyle } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { SpringAnimatedSafeAreaView } from '../animated/spring/SpringAnimatedSafeAreaView'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedSafeAreaViewProps extends Omit<TextProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children?: React.ReactNode
  style?: StyleProp<Omit<TextStyle, 'backgroundColor' | 'borderColor'>>
}

export const ThemedSafeAreaView = React.forwardRef<
  SpringAnimatedSafeAreaView,
  ThemedSafeAreaViewProps
>((props, ref) => {
  const { backgroundColor, borderColor, style, ...otherProps } = props
  const springAnimatedTheme = useSpringAnimatedTheme()

  return (
    <SpringAnimatedSafeAreaView
      {...otherProps}
      ref={ref}
      style={[
        style,
        getStyle(springAnimatedTheme, { backgroundColor, borderColor }),
      ]}
    />
  )
})

function getStyle(
  theme: ThemeColors,
  {
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
  }: Pick<ThemedSafeAreaViewProps, 'backgroundColor' | 'borderColor'>,
) {
  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })
  const borderColor = getThemeColorOrItself(theme, _borderColor, {
    enableCSSVariable: true,
  })

  const style: TextStyle = {}
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (borderColor) style.color = borderColor

  return style
}
