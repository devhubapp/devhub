import React from 'react'
import { StyleProp, Text, TextProps, TextStyle } from 'react-native'

import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTextProps extends Omit<TextProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children?: React.ReactNode
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
  style?: StyleProp<Omit<TextStyle, 'backgroundColor' | 'color'>>
  themeTransformer?: ThemeTransformer
}

export const ThemedText = React.forwardRef<Text, ThemedTextProps>(
  (props, ref) => {
    const {
      backgroundColor,
      color,
      style,
      themeTransformer,
      ...otherProps
    } = props

    const theme = useTheme({ themeTransformer })

    return (
      <Text
        {...otherProps}
        ref={ref}
        style={[style, getStyle(theme, { backgroundColor, color })]}
      />
    )
  },
)

function getStyle(
  theme: Theme,
  {
    backgroundColor: _backgroundColor,
    color: _color,
  }: Pick<ThemedTextProps, 'backgroundColor' | 'color'>,
) {
  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })
  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  const style: TextStyle = {}
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (color) style.color = color

  return style
}
