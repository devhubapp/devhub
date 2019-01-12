import React, { ReactNode } from 'react'
import {
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
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'

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
    borderWidth: 1,
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
    <AnimatedView
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
      <AnimatedText
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
      </AnimatedText>
    </AnimatedView>
  )
}
