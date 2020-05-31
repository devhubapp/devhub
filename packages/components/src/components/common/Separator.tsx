import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { scaleFactor } from '../../styles/variables'
import { ThemedView } from '../themed/ThemedView'

export const separatorSize = 1 * scaleFactor
export const separatorThickSize = 5 * scaleFactor

export function getSeparatorThemeColor({
  isDark,
}: {
  isDark: boolean
}): keyof ThemeColors {
  return isDark ? 'backgroundColorLighther1' : 'backgroundColorDarker1'
}

const styles = StyleSheet.create({
  absoluteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  absoluteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  absoluteLeft: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },

  absoluteRight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
  },
})

export interface SeparatorProps {
  absolute?: 'none' | 'top' | 'bottom' | 'left' | 'right'
  backgroundThemeColor?: keyof ThemeColors
  half?: boolean
  horizontal: boolean
  inverted?: boolean
  leftOffset?: number
  thick?: boolean
  zIndex?: number
}

export const Separator = React.memo((props: SeparatorProps) => {
  const {
    absolute,
    backgroundThemeColor: _backgroundThemeColor,
    half,
    horizontal,
    inverted,
    leftOffset,
    thick,
    zIndex,
  } = props

  const backgroundThemeColor =
    _backgroundThemeColor ||
    ((theme: Theme) => getSeparatorThemeColor({ isDark: theme.isDark }))

  const size = (thick ? separatorThickSize : separatorSize) / (half ? 2 : 1)

  const absoluteStyle =
    absolute === 'top'
      ? styles.absoluteTop
      : absolute === 'bottom'
      ? styles.absoluteBottom
      : absolute === 'left'
      ? styles.absoluteLeft
      : absolute === 'right'
      ? styles.absoluteRight
      : undefined

  const separatorStyle = [
    horizontal
      ? { width: '100%', height: size }
      : { width: size, height: '100%' },
  ]

  return (
    <View
      style={[
        horizontal
          ? {
              flexDirection: inverted ? 'column-reverse' : 'column',
              width: '100%',
            }
          : { flexDirection: inverted ? 'row-reverse' : 'row', height: '100%' },
        absoluteStyle,
        !!leftOffset && { marginLeft: leftOffset },
        !!zIndex && { zIndex },
      ]}
      pointerEvents="none"
    >
      {!!backgroundThemeColor && (
        <ThemedView
          backgroundColor={backgroundThemeColor}
          style={separatorStyle}
          pointerEvents="none"
        />
      )}
    </View>
  )
})

Separator.displayName = 'Separator'
