import React from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native'

import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

export const buttonSize = 40

export interface ButtonProps extends TouchableOpacityProps {
  children: string | React.ReactNode
  disabled?: boolean
  loading?: boolean
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function Button(props: ButtonProps) {
  const theme = useTheme()

  const {
    children,
    disabled,
    loading,
    style,
    useBrandColor,
    ...otherProps
  } = props

  return (
    <TouchableOpacity
      {...otherProps}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: buttonSize,
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
  )
}
