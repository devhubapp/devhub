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
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<Omit<TouchableOpacityProps['style'], 'backgroundColor'>>
  themeTransformer?: ThemeTransformer
}

export const ThemedTouchableOpacity = React.forwardRef<
  TouchableOpacity,
  ThemedTouchableOpacityProps
>((props, ref) => {
  const {
    backgroundColor: _backgroundColor,
    style,
    themeTransformer,
    ...otherProps
  } = props

  const theme = useTheme({ themeTransformer })

  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })

  return (
    <TouchableOpacity
      {...otherProps}
      ref={ref}
      style={[style, { backgroundColor }]}
    />
  )
})

ThemedTouchableOpacity.displayName = 'ThemedTouchableOpacity'

export type ThemedTouchableOpacity = TouchableOpacity
