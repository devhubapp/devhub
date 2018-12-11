import React from 'react'
import { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native'

import { GitHubIcon } from '@devhub/core/src/types'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'
import {
  AnimatedTouchableOpacity,
  AnimatedTouchableOpacityProps,
} from '../animated/AnimatedTouchableOpacity'

export const fabSize = 48

export interface FABProps extends AnimatedTouchableOpacityProps {
  children?: string | React.ReactElement<any>
  iconName?: GitHubIcon
  iconStyle?: StyleProp<TextStyle> | any
  onPress: AnimatedTouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export function FAB(props: FABProps) {
  const theme = useAnimatedTheme()

  const {
    children,
    iconName,
    iconStyle,
    style,
    useBrandColor,
    ...otherProps
  } = props

  return (
    <AnimatedTouchableOpacity
      analyticsCategory="fab"
      {...otherProps}
      hitSlop={{
        top: contentPadding / 2,
        bottom: contentPadding / 2,
        left: contentPadding,
        right: contentPadding,
      }}
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: fabSize,
          height: fabSize,
          borderRadius: fabSize / 2,
          backgroundColor: useBrandColor
            ? colors.brandBackgroundColor
            : theme.backgroundColorMore08,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          zIndex: 1,
        },
        style,
      ]}
    >
      {typeof iconName === 'string' ? (
        <AnimatedIcon
          color={
            useBrandColor ? colors.brandForegroundColor : theme.foregroundColor
          }
          name={iconName}
          style={[{ fontSize: 20 }, iconStyle]}
        />
      ) : typeof children === 'string' ? (
        <Animated.Text
          style={{
            fontWeight: '500',
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
