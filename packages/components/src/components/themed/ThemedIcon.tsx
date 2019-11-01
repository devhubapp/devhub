import { Theme, ThemeColors, ThemeTransformer } from '@devhub/core'
import React from 'react'
import { StyleProp } from 'react-native'

import {
  MaterialIconProps,
  MaterialIcons,
  OcticonIconProps,
  Octicons,
} from '../../libs/vector-icons'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export type ThemedIconProps = {
  color?: keyof ThemeColors | ((theme: Theme) => string)
  style?: StyleProp<Omit<OcticonIconProps['style'], 'color'>>
  themeTransformer?: ThemeTransformer
} & (
  | ({
      family?: 'octicon'
    } & Omit<OcticonIconProps, 'color' | 'style'>)
  | ({
      family?: 'material'
    } & Omit<MaterialIconProps, 'color' | 'style'>))

export const ThemedIcon = React.memo(
  React.forwardRef<Octicons | MaterialIcons, ThemedIconProps>((props, ref) => {
    const {
      color: _color,
      family = 'octicon',
      themeTransformer,
      ...otherProps
    } = props

    const theme = useTheme({ themeTransformer })

    const color = getThemeColorOrItself(theme, _color, {
      enableCSSVariable: true,
    })

    if (family === 'material')
      return <MaterialIcons ref={ref} {...otherProps} color={color} />

    return <Octicons ref={ref} {...otherProps} color={color} />
  }),
)

ThemedIcon.displayName = 'ThemedIcon'

export type ThemedIcon = Octicons | MaterialIcons
