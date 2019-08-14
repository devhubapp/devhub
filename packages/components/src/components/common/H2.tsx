import React from 'react'
import { TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'

export type H2Props = TextProps & {
  children: string
  color?: ThemedTextProps['color']
  muted?: boolean
  withMargin?: boolean
}

export function H2(props: H2Props) {
  const { children, color, muted, style, withMargin, ...otherProps } = props

  return (
    <ThemedText
      color={color || (muted ? 'foregroundColorMuted65' : 'foregroundColor')}
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '500',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </ThemedText>
  )
}
