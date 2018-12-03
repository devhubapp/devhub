import React from 'react'
import { Text, TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export type H3Props = TextProps & { children: string; withMargin?: boolean }

export function H3(props: H3Props) {
  const theme = useTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <Text
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '400',
          color: theme.foregroundColorTransparent50,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </Text>
  )
}
