import React from 'react'
import { StyleSheet } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { ThemedView } from '../themed/ThemedView'

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

export const Separator = React.memo((props: SeparatorProps) => {
  const { backgroundThemeColor, half, horizontal, thick, zIndex } = props

  const size = (thick ? separatorThickSize : separatorSize) / (half ? 2 : 1)

  return (
    <ThemedView
      backgroundColor={theme => {
        const themeField =
          backgroundThemeColor || getSeparatorThemeColor(theme.backgroundColor)
        return theme[themeField]
      }}
      style={[
        horizontal
          ? { width: '100%', height: size }
          : { width: size, height: '100%' },
        !!zIndex && { zIndex },
      ]}
      pointerEvents="none"
    />
  )
})
