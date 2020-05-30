import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import React from 'react'
import { StyleProp } from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'

import {
  IconProp,
  MaterialIcons,
  OcticonIconProps,
  Octicons,
} from '../../libs/vector-icons'
import { normalTextSize } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export type ThemedIconProps = {
  color?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<Omit<OcticonIconProps['style'], 'color'>>
  themeTransformer?: ThemeTransformer
} & IconProp &
  Omit<IconProps, 'color' | 'style' | 'name'>

export const ThemedIcon = React.memo(
  React.forwardRef<Octicons | MaterialIcons, ThemedIconProps>((props, ref) => {
    const {
      color: _color,
      family = 'octicon',
      size = normalTextSize,
      themeTransformer,
      ...otherProps
    } = props

    const theme = useTheme({ themeTransformer })

    const color = getThemeColorOrItself(theme, _color, {
      enableCSSVariable: true,
    })

    if (family === 'material')
      return (
        <MaterialIcons ref={ref} {...otherProps} color={color} size={size} />
      )

    return <Octicons ref={ref} {...otherProps} color={color} size={size} />
  }),
)

ThemedIcon.displayName = 'ThemedIcon'

export type ThemedIcon = Octicons | MaterialIcons
