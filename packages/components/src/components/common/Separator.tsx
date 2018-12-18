import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'

export const separatorSize = StyleSheet.hairlineWidth
export const separatorTickSize = 2

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
}

export function Separator(props: SeparatorProps) {
  const theme = useAnimatedTheme()

  const { horizontal, thick } = props
  const size = thick ? separatorTickSize : separatorSize

  return (
    <Animated.View
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
        { backgroundColor: theme.backgroundColorDarker08 },
      ]}
    />
  )
}
