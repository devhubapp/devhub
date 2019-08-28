import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Theme, ThemeColors } from '@devhub/core'
import { useTheme } from './context/ThemeContext'
import { getThemeColorOrItself } from './themed/helpers'

export interface TriangleProps {
  color: keyof ThemeColors | ((theme: Theme) => string | undefined) | null
  degree: number
  size: number
  type: 'border' | 'center'
}

export function Triangle(props: TriangleProps) {
  const {
    color: _color = 'red',
    degree = 0,
    size = 100,
    type = 'border',
  } = props

  const theme = useTheme()

  const color = getThemeColorOrItself(theme, _color, {
    enableCSSVariable: true,
  })

  return (
    <View
      style={[
        styles.triangle,
        type === 'border'
          ? {
              borderBottomWidth: size,
              borderLeftWidth: size,
              borderRightWidth: 0,
              borderBottomColor: color,
              transform: [{ rotate: `${degree}deg` }],
            }
          : {
              borderBottomWidth: size,
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomColor: color,
              transform: [{ rotate: `${degree}deg` }],
            },
      ]}
    />
  )
}

const styles = StyleSheet.create({
  triangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderWidth: 0,
  },
})
