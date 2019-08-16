import React from 'react'
import { StyleSheet } from 'react-native'

import { ThemedView } from '../../themed/ThemedView'

export interface CardBorderProps {}

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

export function CardBorder() {
  return (
    <ThemedView
      backgroundColor="primaryBackgroundColor"
      style={styles.cardBorder}
    />
  )
}
