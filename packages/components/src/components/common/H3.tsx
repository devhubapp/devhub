import React from 'react'
import { TextProps } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'

export type H3Props = TextProps & { children: string; withMargin?: boolean }

export function H3(props: H3Props) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const { children, style, withMargin, ...otherProps } = props

  return (
    <SpringAnimatedText
      {...otherProps}
      style={[
        {
          marginBottom: withMargin ? contentPadding : undefined,
          fontWeight: '400',
          color: springAnimatedTheme.foregroundColorMuted50,
        },
        style,
      ]}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </SpringAnimatedText>
  )
}
