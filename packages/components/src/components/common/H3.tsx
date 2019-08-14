import React from 'react'
import { TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'

export type H3Props = TextProps & {
  children: string
  color?: ThemedTextProps['color']
  withMargin?: boolean
}

export function H3(props: H3Props) {
  const { children, color, style, withMargin, ...otherProps } = props

  return (
    <ThemedText
      color={color || 'foregroundColorMuted65'}
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '400',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </ThemedText>
  )
}
