import React from 'react'
import { Animated, TextProps } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'

export type H2Props = TextProps & { children: string; withMargin?: boolean }

export function H2(props: H2Props) {
  const theme = useAnimatedTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <Animated.Text
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
    </Animated.Text>
  )
}
