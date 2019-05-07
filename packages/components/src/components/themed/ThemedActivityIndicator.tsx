import React from 'react'
import { ActivityIndicator, ActivityIndicatorProps } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedActivityIndicatorProps
  extends Omit<ActivityIndicatorProps, 'color'> {
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
}

export const ThemedActivityIndicator = (
  props: ThemedActivityIndicatorProps,
) => {
  const { color: _color, ...otherProps } = props

  const theme = useTheme()

  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  return <ActivityIndicator {...otherProps} color={color} />
}
