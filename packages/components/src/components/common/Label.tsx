import React, { ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { separatorSize } from './Separator'

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
  small?: boolean
  textColor?: string
  textProps?: TextProps
}

export function Label(props: LabelProps) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    borderColor,
    children,
    color: _color,
    containerProps = {},
    containerStyle,
    isPrivate,
    muted,
    outline,
    radius = defaultRadius,
    small,
    textColor,
    textProps = {},
  } = props

  const springAnimatedColor =
    textColor ||
    (outline
      ? _color ||
        (muted
          ? springAnimatedTheme.foregroundColorMuted50
          : springAnimatedTheme.foregroundColor)
      : '#FFFFFF')

  return (
    <SpringAnimatedView
      {...containerProps}
      style={[
        {
          borderRadius: defaultRadius,
          borderWidth: separatorSize,
          paddingHorizontal: contentPadding / (small ? 2 : 1),
        },
        containerProps && containerProps.style,
        containerStyle,
        {
          borderColor:
            borderColor || _color || springAnimatedTheme.foregroundColor,
        },
        !outline && {
          backgroundColor: _color || springAnimatedTheme.foregroundColor,
        },
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      <SpringAnimatedText
        numberOfLines={1}
        {...textProps}
        style={[
          {
            lineHeight: small ? 16 : 18,
            fontSize: small ? 13 : 14,
            color: springAnimatedColor,
          },
          textProps && textProps.style,
          muted && { opacity: mutedOpacity },
        ]}
      >
        {Boolean(isPrivate) && (
          <Text>
            <SpringAnimatedIcon
              name="lock"
              style={{ color: springAnimatedColor }}
            />{' '}
          </Text>
        )}
        {children}
      </SpringAnimatedText>
    </SpringAnimatedView>
  )
}
