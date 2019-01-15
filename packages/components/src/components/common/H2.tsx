import React from 'react'
import { TextProps } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'

export type H2Props = TextProps & { children: string; withMargin?: boolean }

export function H2(props: H2Props) {
  const theme = useAnimatedTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <AnimatedText
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '600',
          color: theme.foregroundColor,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </AnimatedText>
  )
}
