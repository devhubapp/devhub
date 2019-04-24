import React from 'react'

import { Platform } from '../../../libs/platform'
import { ThemedView } from '../../themed/ThemedView'

export interface CardFocusBorderProps {}

export function CardFocusBorder() {
  if (Platform.realOS !== 'web') return null

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
