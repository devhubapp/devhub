import React from 'react'
import { StyleProp } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { OcticonIconProps, Octicons } from '../../libs/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedIconProps
  extends Omit<OcticonIconProps, 'color' | 'style'> {
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
  style?: StyleProp<Omit<OcticonIconProps['style'], 'color'>>
}

export const ThemedIcon = (props: ThemedIconProps) => {
  const { color: _color, ...otherProps } = props

  const theme = useTheme()

  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  return <Octicons {...otherProps} color={color} />
}
