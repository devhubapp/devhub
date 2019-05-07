import React from 'react'
import { TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemedText } from '../themed/ThemedText'

export type H2Props = TextProps & {
  children: string
  muted?: boolean
  withMargin?: boolean
}

export function H2(props: H2Props) {
  const { children, muted, style, withMargin, ...otherProps } = props

  return (
    <ThemedText
      color={muted ? 'foregroundColorMuted50' : 'foregroundColor'}
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '600',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </ThemedText>
  )
}
