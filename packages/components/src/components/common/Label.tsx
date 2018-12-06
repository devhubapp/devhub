import React, { ReactNode } from 'react'
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'
import { AnimatedIcon } from '../animated/AnimatedIcon'

export interface LabelProps {
  borderColor?: string
  children: ReactNode
  color?: string
  containerProps?: ViewProps
  containerStyle?: StyleProp<ViewStyle>
  isPrivate?: boolean
  muted?: boolean
  outline?: boolean
  radius?: number
  textColor?: string
  textProps?: TextProps
}

const styles = StyleSheet.create({
  labelContainer: {
    borderRadius: defaultRadius,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: contentPadding,
    paddingVertical: 2,
  },

  labelText: {
    fontSize: 14,
  },
})

export function Label(props: LabelProps) {
  const theme = useAnimatedTheme()

  const {
    borderColor,
    color: _color,
    children,
    containerStyle,
    containerProps = {},
    muted,
    outline,
    isPrivate,
    radius = defaultRadius,
    textColor,
    textProps = {},
  } = props

  const color =
    textColor ||
    (outline
      ? _color || (muted ? theme.foregroundColorMuted50 : theme.foregroundColor)
      : '#FFFFFF')

  return (
    <Animated.View
      style={[
        styles.labelContainer,
        containerStyle,
        { borderColor: borderColor || _color || theme.foregroundColor },
        !outline && {
          backgroundColor: _color || theme.foregroundColor,
        },
        Boolean(radius) && { borderRadius: radius },
      ]}
      {...containerProps}
    >
      <Animated.Text
        numberOfLines={1}
        style={[
          styles.labelText,
          {
            color,
          },
          muted && { opacity: mutedOpacity },
        ]}
        {...textProps}
      >
        {Boolean(isPrivate) && (
          <Text>
            <AnimatedIcon color={color} name="lock" />{' '}
          </Text>
        )}
        {children}
      </Animated.Text>
    </Animated.View>
  )
}
