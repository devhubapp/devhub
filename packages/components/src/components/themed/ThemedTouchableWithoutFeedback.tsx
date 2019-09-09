import React from 'react'
import { StyleProp } from 'react-native'

import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from '../common/TouchableWithoutFeedback'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedTouchableWithoutFeedbackProps
  extends Omit<TouchableWithoutFeedbackProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<
    Omit<TouchableWithoutFeedbackProps['style'], 'backgroundColor'>
  >
  themeTransformer?: ThemeTransformer
}

export const ThemedTouchableWithoutFeedback = React.forwardRef<
  TouchableWithoutFeedback,
  ThemedTouchableWithoutFeedbackProps
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
    <TouchableWithoutFeedback
      {...otherProps}
      ref={ref}
      style={[style, { backgroundColor }]}
    />
  )
})

ThemedTouchableWithoutFeedback.displayName = 'ThemedTouchableWithoutFeedback'

export type ThemedTouchableWithoutFeedback = TouchableWithoutFeedback
