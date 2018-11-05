import React from 'react'
import { Text, TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

export type H3Props = TextProps & { children: string; withMargin?: boolean }

export const H3: React.SFC<H3Props> = ({
  children,
  style,
  withMargin,
  ...props
}) => (
  <ThemeConsumer>
    {({ theme }) => (
      <Text
        {...props}
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
    )}
  </ThemeConsumer>
)
