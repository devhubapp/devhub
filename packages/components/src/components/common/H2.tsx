import React from 'react'
import { Text, TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export type H2Props = TextProps & { children: string; withMargin?: boolean }

export function H2(props: H2Props) {
  const theme = useTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <Text
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '600',
          color: theme.foregroundColorTransparent80,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  )
}
