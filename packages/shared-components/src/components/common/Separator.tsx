import React from 'react'
import { StyleSheet, View } from 'react-native'

import { useTheme } from '../context/ThemeContext'

export interface SeparatorProps {
  horizontal?: boolean
  thick?: boolean
}

export function Separator(props: SeparatorProps) {
  const theme = useTheme()

  const { horizontal, thick } = props
  const size = thick ? 2 : StyleSheet.hairlineWidth

  return (
    <View
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
