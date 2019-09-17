import React from 'react'
import { StyleProp } from 'react-native'

import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTouchableOpacityProps
  extends Omit<TouchableOpacityProps, 'style'> {
  borderColor?: keyof ThemeColors | ((theme: Theme) => string)
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<
    Omit<TouchableOpacityProps['style'], 'backgroundColor' | 'borderColor'>
  >
  themeTransformer?: ThemeTransformer
}

export const ThemedTouchableOpacity = React.forwardRef<
  TouchableOpacity,
  ThemedTouchableOpacityProps
>((props, ref) => {
  const {
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
    style,
    themeTransformer,
    ...otherProps
  } = props

  const theme = useTheme({ themeTransformer })

  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })

  const borderColor = getThemeColorOrItself(theme, _borderColor, {
    enableCSSVariable: true,
  })

  return (
    <TouchableOpacity
      {...otherProps}
      ref={ref}
      style={[style, { backgroundColor, borderColor }]}
    />
  )
})

ThemedTouchableOpacity.displayName = 'ThemedTouchableOpacity'

export type ThemedTouchableOpacity = TouchableOpacity
