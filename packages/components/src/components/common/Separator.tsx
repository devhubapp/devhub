import React from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export const separatorSize = StyleSheet.hairlineWidth
export const separatorThickSize = 5

export function getSeparatorThemeColor(
  _backgroundColor: string,
): keyof ThemeColors {
  // const luminance = getLuminance(backgroundColor)

  // if (luminance <= 0.02) return 'backgroundColorLess2'
  return 'backgroundColorLess1'
}

export interface SeparatorProps {
  backgroundThemeColor?: keyof ThemeColors
  half?: boolean
  horizontal?: boolean
  thick?: boolean
  zIndex?: number
}

export function Separator(props: SeparatorProps) {
  const { backgroundThemeColor, half, horizontal, thick, zIndex } = props

  const theme = useTheme()
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const size = (thick ? separatorThickSize : separatorSize) / (half ? 2 : 1)
  const themeField =
    backgroundThemeColor || getSeparatorThemeColor(theme.backgroundColor)

  return (
    <SpringAnimatedView
      style={[
        horizontal
          ? {
              width: '100%',
              height: size,
            }
          : {
              width: size,
              height: '100%',
            },
        {
          backgroundColor: springAnimatedTheme[themeField],
        },
        !!zIndex && { zIndex },
      ]}
    />
  )
}
