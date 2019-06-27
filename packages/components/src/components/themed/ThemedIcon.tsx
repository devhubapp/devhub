import React from 'react'
import { StyleProp } from 'react-native'

import { ThemeColors, ThemeTransformer } from '@devhub/core'
import { OcticonIconProps, Octicons } from '../../libs/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedIconProps
  extends Omit<OcticonIconProps, 'color' | 'style'> {
  color?: keyof ThemeColors | ((theme: ThemeColors) => string)
  style?: StyleProp<Omit<OcticonIconProps['style'], 'color'>>
  themeTransformer?: ThemeTransformer
}

export const ThemedIcon = (props: ThemedIconProps) => {
  const { color: _color, themeTransformer, ...otherProps } = props

  const theme = useTheme({ themeTransformer })

  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  return <Octicons {...otherProps} color={color} />
}

ThemedIcon.displayName = 'ThemedIcon'
