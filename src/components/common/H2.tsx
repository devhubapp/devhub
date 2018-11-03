import React from 'react'
import { Text, TextProps } from 'react-native'

import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

export type H2Props = TextProps & { children: string; withMargin?: boolean }

export const H2: React.SFC<H2Props> = ({
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
            fontWeight: '600',
            color: theme.foregroundColor,
          },
          style,
        ]}
      >
        {typeof children === 'string' ? children.toUpperCase() : children}
      </Text>
    )}
  </ThemeConsumer>
)
