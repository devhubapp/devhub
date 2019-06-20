import React from 'react'

import { ThemedView } from '../../themed/ThemedView'

export interface CardBorderProps {}

export function CardBorder() {
  return (
    <ThemedView
      backgroundColor="primaryBackgroundColor"
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 2,
      }}
    />
  )
}
