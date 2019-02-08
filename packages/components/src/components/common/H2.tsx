import React from 'react'
import { TextProps } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'

export type H2Props = TextProps & {
  children: string
  muted?: boolean
  withMargin?: boolean
}

export function H2(props: H2Props) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const { children, muted, style, withMargin, ...otherProps } = props

  return (
    <SpringAnimatedText
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '600',
          color: muted
            ? springAnimatedTheme.foregroundColorMuted50
            : springAnimatedTheme.foregroundColor,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </SpringAnimatedText>
  )
}
