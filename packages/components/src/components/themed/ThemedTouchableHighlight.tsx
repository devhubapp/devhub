import React from 'react'
import { StyleProp } from 'react-native'

import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import {
  TouchableHighlight,
  TouchableHighlightProps,
} from '../common/TouchableHighlight'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTouchableHighlightProps
  extends Omit<TouchableHighlightProps, 'underlayColor' | 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<Omit<TouchableHighlightProps['style'], 'backgroundColor'>>
  themeTransformer?: ThemeTransformer
  underlayColor?: keyof ThemeColors | ((theme: Theme) => string)
}

export const ThemedTouchableHighlight = React.forwardRef<
  TouchableHighlight,
  ThemedTouchableHighlightProps
>((props, ref) => {
  const {
    backgroundColor: _backgroundColor,
    style,
    themeTransformer,
    underlayColor: _underlayColor,
    ...otherProps
  } = props

  const theme = useTheme({ themeTransformer })

  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })

  const underlayColor = getThemeColorOrItself(theme, _underlayColor, {
    enableCSSVariable: true,
  })

  return (
    <TouchableHighlight
      {...otherProps}
      ref={ref}
      underlayColor={underlayColor}
      style={[style, { backgroundColor }]}
    />
  )
})

ThemedTouchableHighlight.displayName = 'ThemedTouchableHighlight'

export type ThemedTouchableHighlight = TouchableHighlight
