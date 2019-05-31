import { getLuminance } from 'polished'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { ThemeColors } from '@devhub/core'
import { ThemedView } from '../themed/ThemedView'

export const separatorSize = StyleSheet.hairlineWidth * 2
export const separatorThickSize = 5

export function getSeparatorThemeColors(
  backgroundColor: string,
): [keyof ThemeColors, keyof ThemeColors | undefined] {
  const luminance = getLuminance(backgroundColor)

  if (luminance >= 0.6)
    return ['backgroundColorDarker1', 'backgroundColorLighther3']

  if (luminance <= 0.01)
    return ['backgroundColorDarker3', 'backgroundColorLighther1']

  return ['backgroundColorDarker2', 'backgroundColorLighther2']
}

export interface SeparatorProps {
  backgroundThemeColor1?: keyof ThemeColors
  backgroundThemeColor2?: keyof ThemeColors
  half?: boolean
  horizontal?: boolean
  thick?: boolean
  zIndex?: number
}

export const Separator = React.memo((props: SeparatorProps) => {
  const {
    backgroundThemeColor1: _backgroundThemeColor1,
    backgroundThemeColor2: _backgroundThemeColor2,
    half,
    horizontal,
    thick,
    zIndex,
  } = props

  const backgroundThemeColor1 =
    _backgroundThemeColor1 ||
    ((theme: ThemeColors) => getSeparatorThemeColors(theme.backgroundColor)[0])

  const backgroundThemeColor2 = _backgroundThemeColor1
    ? _backgroundThemeColor2
    : (theme: ThemeColors) => getSeparatorThemeColors(theme.backgroundColor)[1]

  const _twoSeparators = !!(backgroundThemeColor1 && backgroundThemeColor2)

  const size =
    (thick ? separatorThickSize : separatorSize) /
    (half ? 2 : 1) /
    (_twoSeparators ? 2 : 1)

  const separatorStyle = [
    horizontal
      ? { width: '100%', height: size }
      : { width: size, height: '100%' },
    !!zIndex && { zIndex },
  ]

  return (
    <View
      style={
        horizontal
          ? { flexDirection: 'column', width: '100%' }
          : { flexDirection: 'row', height: '100%' }
      }
    >
      {!!backgroundThemeColor1 && (
        <ThemedView
          backgroundColor={backgroundThemeColor1}
          style={separatorStyle}
          pointerEvents="none"
        />
      )}

      {!!backgroundThemeColor2 && (
        <ThemedView
          backgroundColor={backgroundThemeColor2}
          style={separatorStyle}
          pointerEvents="none"
        />
      )}
    </View>
  )
})
