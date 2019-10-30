import React from 'react'
import { StyleSheet, View } from 'react-native'

import { ThemedView, ThemedViewProps } from '../../themed/ThemedView'

export interface CardLeftBorderProps {
  style?: ThemedViewProps['style']
}

const styles = StyleSheet.create({
  cardBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 2,
    zIndex: 1000,
  },
})

export const CardLeftBorder = React.forwardRef<View, CardLeftBorderProps>(
  (props, ref) => {
    const { style } = props

    return (
      <ThemedView
        ref={ref}
        backgroundColor="primaryBackgroundColor"
        style={[styles.cardBorder, style]}
        pointerEvents="none"
      />
    )
  },
)
