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
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

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
      style={[
        styles.labelContainer,
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
      {...containerProps}
    >
      <SpringAnimatedText
        numberOfLines={1}
        style={[
          styles.labelText,
          {
            color: springAnimatedColor,
          },
          muted && { opacity: mutedOpacity },
        ]}
        {...textProps}
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
