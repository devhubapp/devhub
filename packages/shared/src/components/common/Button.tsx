import React from 'react'
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

export interface ButtonProps extends TouchableOpacityProps {
  useBrandColor?: boolean
}

export const Button: React.SFC<ButtonProps> = ({
  useBrandColor,
  children,
  style,
  ...props
}) => (
  <ThemeConsumer>
    {({ theme }) => (
      <TouchableOpacity
        {...props}
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            height: 40,
            paddingHorizontal: contentPadding,
            paddingVertical: contentPadding / 2,
            backgroundColor: useBrandColor
              ? colors.brand
              : theme.backgroundColorMore08,
            borderRadius: radius,
          },
          style,
        ]}
      >
        {typeof children === 'string' ? (
          <Text
            style={{
              fontWeight: '500',
              color: theme.foregroundColor,
            }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </TouchableOpacity>
    )}
  </ThemeConsumer>
)
