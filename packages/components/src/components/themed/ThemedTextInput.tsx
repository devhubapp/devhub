import React from 'react'
import { StyleProp } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { TextInput, TextInputProps } from '../common/TextInput'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTextInputProps extends Omit<TextInputProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children?: React.ReactNode
  style?: StyleProp<
    Omit<TextInputProps['style'], 'backgroundColor' | 'borderColor' | 'color'>
  >
}

export const ThemedTextInput = React.forwardRef<
  TextInput,
  ThemedTextInputProps
>((props, ref) => {
  const { backgroundColor, borderColor, color, style, ...otherProps } = props

  const theme = useTheme()

  return (
    <TextInput
      {...otherProps}
      ref={ref}
      style={[style, getStyle(theme, { backgroundColor, borderColor, color })]}
    />
  )
})

export type ThemedTextInput = typeof ThemedTextInput

function getStyle(
  theme: ThemeColors,
  {
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
    color,
  }: Pick<ThemedTextInputProps, 'backgroundColor' | 'borderColor' | 'color'>,
) {
  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })
  const borderColor = getThemeColorOrItself(theme, _borderColor, {
    enableCSSVariable: true,
  })
  const _color = getThemeColorOrItself(theme, color, {
    enableCSSVariable: true,
  })

  const style: TextInputProps['style'] = {}
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (borderColor) style.borderColor = borderColor
  if (_color) style.color = _color

  return style
}
