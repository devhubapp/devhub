import React from 'react'
import { Animated } from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { AnimatedActivityIndicator } from '../animated/AnimatedActivityIndicator'
import { AnimatedTouchableOpacity } from '../animated/AnimatedTouchableOpacity'
import { TouchableOpacityProps } from './TouchableOpacity'

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
    <AnimatedTouchableOpacity
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
        <Animated.Text
          style={{
            fontWeight: '500',
            lineHeight: buttonSize,
            color: useBrandColor
              ? colors.brandForegroundColor
              : theme.foregroundColor,
          }}
        >
          {children}
        </Animated.Text>
      ) : (
        children
      )}
    </AnimatedTouchableOpacity>
  )
}
