import React, { ReactNode } from 'react'
import { StyleProp, Text, TextProps, ViewProps, ViewStyle } from 'react-native'

import { darken, getLuminance, lighten } from 'polished'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import {
  contentPadding,
  mutedOpacity,
  radius as defaultRadius,
} from '../../styles/variables'
import { getLuminanceDifference } from '../../utils/helpers/colors'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
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

  const _colorLuminanceDiff = _color
    ? Math.abs(getLuminanceDifference(_color, theme.backgroundColor))
    : 0

  const _readableColor =
    _color &&
    (outline && _colorLuminanceDiff < 0.4
      ? theme.isDark
        ? lighten(0.6 - _colorLuminanceDiff, _color)
        : darken(0.6 - _colorLuminanceDiff, _color)
      : _color)

  const color = _readableColor || springAnimatedTheme.foregroundColor

  const foregroundColor =
    _textColor ||
    (outline && color) ||
    (_readableColor
      ? getLuminance(_readableColor) > 0.4
        ? darken(0.9, _readableColor)
        : lighten(0.9, _readableColor)
      : outline
      ? springAnimatedTheme.foregroundColor
      : springAnimatedTheme.backgroundColor)

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
            ? _readableColor
              ? springAnimatedTheme.backgroundColor
              : undefined
            : color,
        },
        muted && { opacity: mutedOpacity },
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      <SpringAnimatedText
        numberOfLines={1}
        {...textProps}
        style={[
          {
            lineHeight: small ? 18 : 19,
            fontSize: small ? 12 : 13,
            color: foregroundColor,
          },
          textProps && textProps.style,
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
        {typeof children === 'string'
          ? parseTextWithEmojisToReactComponents(children, {
              imageProps: {
                style: {
                  width: small ? 10 : 11,
                  height: small ? 10 : 11,
                },
              },
            })
          : children}
      </SpringAnimatedText>
    </SpringAnimatedView>
  )
}
