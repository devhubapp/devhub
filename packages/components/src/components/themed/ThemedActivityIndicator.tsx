import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { ThemeColors, ThemeTransformer } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedActivityIndicatorProps
  extends Omit<ActivityIndicatorProps, 'color'> {
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
  themeTransformer?: ThemeTransformer
}

export const ThemedActivityIndicator = (
  props: ThemedActivityIndicatorProps,
) => {
  const { color: _color, themeTransformer, ...otherProps } = props

  const theme = useTheme({ themeTransformer })

  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  return <ActivityIndicator {...otherProps} color={color} />
}

ThemedActivityIndicator.displayName = 'ThemedActivityIndicator'
