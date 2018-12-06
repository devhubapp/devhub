import React, { ReactNode } from 'react'
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { Octicons as Icon } from '../../libs/vector-icons'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'

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
    color,
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

  return (
    <Animated.View
      style={[
        styles.labelContainer,
        containerStyle,
        { borderColor: borderColor || color || theme.foregroundColor },
        !outline && {
          backgroundColor: color || theme.foregroundColor,
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
            color:
              textColor ||
              (outline
                ? color ||
                  (muted ? theme.foregroundColorMuted50 : theme.foregroundColor)
                : '#FFFFFF'),
          },
          muted && { opacity: mutedOpacity },
        ]}
        {...textProps}
      >
        {Boolean(isPrivate) && (
          <Text>
            <Icon name="lock" />{' '}
          </Text>
        )}
        {children}
      </Animated.Text>
    </Animated.View>
  )
}
