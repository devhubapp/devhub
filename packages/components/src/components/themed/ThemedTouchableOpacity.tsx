import React from 'react'
import { StyleProp } from 'react-native'

import { ThemeColors } from '@devhub/core'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTouchableOpacityProps
  extends Omit<TouchableOpacityProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  style?: StyleProp<Omit<TouchableOpacityProps['style'], 'backgroundColor'>>
}

export const ThemedTouchableOpacity = React.forwardRef<
  TouchableOpacity,
  ThemedTouchableOpacityProps
>((props, ref) => {
  const { backgroundColor: _backgroundColor, style, ...otherProps } = props

  const theme = useTheme()

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
