import React from 'react'

import { sharedStyles } from '../../../styles/shared'
import { contentPadding, smallAvatarSize } from '../../../styles/variables'
import { ThemedIcon } from '../../themed/ThemedIcon'

export interface CardBorderProps {
  size?: number
}

export function CardBookmarkIndicator(props: CardBorderProps) {
  const { size: _size = smallAvatarSize } = props

  const size = _size * 1.3

  return (
    <ThemedIcon
      color="primaryBackgroundColor"
      name="bookmark"
      size={size}
      style={[
        sharedStyles.absolute,
        {
          top: -size * 0.7,
          right: contentPadding / 3 + size / 3,
          // transform: [{ rotate: '-90deg' }],
        },
      ]}
    />
  )
}
