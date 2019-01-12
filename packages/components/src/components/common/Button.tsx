import React from 'react'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedText } from '../animated/AnimatedText'
import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity'

export const buttonSize = 40

export interface ButtonProps extends TouchableOpacityProps {
  children: string | React.ReactNode
  disabled?: boolean
  loading?: boolean
  onPress: TouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function Button(props: ButtonProps) {
  const theme = useAnimatedTheme()

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
      animated
      {...otherProps}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          height: buttonSize,
          paddingHorizontal: contentPadding,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : (theme.backgroundColorMore08 as any),
          borderRadius: radius,
        },
        style,
      ]}
    >
      {loading ? (
        <AnimatedActivityIndicator
          color={theme.foregroundColor as any}
          size="small"
        />
      ) : typeof children === 'string' ? (
        <AnimatedText
          style={{
            lineHeight: 14,
            fontSize: 14,
            fontWeight: '500',
            color: useBrandColor
              ? colors.brandForegroundColor
              : theme.foregroundColor,
          }}
        >
          {children}
        </AnimatedText>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}
