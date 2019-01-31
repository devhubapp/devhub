import React, { ReactNode } from 'react'
import { StyleProp, Text, TextProps, ViewProps, ViewStyle } from 'react-native'

import { getLuminance } from 'polished'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'
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
  const theme = useTheme()

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
    textColor: _textColor,
    textProps = {},
  } = props

  const darkTheme = theme.isDark ? theme : theme.invert()
  const lightTheme = theme.isDark ? theme.invert() : theme

  const color =
    _color ||
    (muted
      ? springAnimatedTheme.foregroundColorMuted50
      : springAnimatedTheme.foregroundColor)

  const foregroundColor =
    _textColor ||
    (outline && color) ||
    (_color
      ? getLuminance(_color) > 0.4
        ? lightTheme.foregroundColor
        : darkTheme.foregroundColor
      : springAnimatedTheme.foregroundColor)

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
          borderColor: borderColor || color,
          backgroundColor: outline
            ? _color
              ? getLuminance(_color) > 0.4
                ? springAnimatedTheme.backgroundColorLighther2
                : springAnimatedTheme.backgroundColorDarker2
              : undefined
            : color,
        },
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      <SpringAnimatedText
        numberOfLines={1}
        {...textProps}
        style={[
          {
            lineHeight: small ? 17 : 18,
            fontSize: small ? 13 : 14,
            color: foregroundColor,
          },
          textProps && textProps.style,
          muted && { opacity: mutedOpacity },
        ]}
      >
        {Boolean(isPrivate) && (
          <Text>
            <SpringAnimatedIcon
              name="lock"
              style={{ color: foregroundColor }}
            />{' '}
          </Text>
        )}
        {children}
      </SpringAnimatedText>
    </SpringAnimatedView>
  )
}
