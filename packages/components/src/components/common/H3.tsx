import React from 'react'
import { TextProps } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'

export type H3Props = TextProps & { children: string; withMargin?: boolean }

export function H3(props: H3Props) {
  const theme = useAnimatedTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <AnimatedText
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '400',
          color: theme.foregroundColorMuted50,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </AnimatedText>
  )
}
