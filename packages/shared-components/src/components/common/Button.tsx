import React from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'

import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'
import { Spacer } from './Spacer'

export interface ButtonProps extends TouchableOpacityProps {
  disabled?: boolean
  loading?: boolean
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export const Button: React.SFC<ButtonProps> = ({
  children,
  disabled,
  loading,
  style,
  useBrandColor,
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
              ? colors.brandBackgroundColor
              : theme.backgroundColorMore08,
            borderRadius: radius,
          },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={theme.foregroundColor} size="small" />
        ) : typeof children === 'string' ? (
          <Text
            style={{
              fontWeight: '500',
              color: useBrandColor
                ? colors.brandForegroundColor
                : theme.foregroundColor,
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
