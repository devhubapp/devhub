import React from 'react'

import { contentPadding, smallAvatarSize } from '../../../styles/variables'
import { ThemedIcon } from '../../themed/ThemedIcon'

export interface CardFocusBorderProps {
  size?: number
}

export function CardBookmarkIndicator(props: CardFocusBorderProps) {
  const { size: _size = smallAvatarSize } = props

  const size = _size * 1.3

  return (
    <ThemedIcon
      color="primaryBackgroundColor"
      name="bookmark"
      size={size}
      style={{
        position: 'absolute',
        top: -size * 0.7,
        right: contentPadding / 3 + size / 3,
        // transform: [{ rotate: '-90deg' }],
      }}
    />
  )
}
