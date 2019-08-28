import React from 'react'
import { StyleSheet } from 'react-native'

import { ThemedView } from '../../themed/ThemedView'

export interface CardFocusIndicatorProps {}

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

export function CardFocusIndicator(_props: CardFocusIndicatorProps) {
  return (
    <ThemedView
      backgroundColor="primaryBackgroundColor"
      style={styles.cardBorder}
    />
  )
}
