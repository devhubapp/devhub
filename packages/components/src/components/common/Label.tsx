import React, { ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { ThemeColors } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export interface LabelProps {
  backgroundThemeColor?: keyof ThemeColors
  borderColor?: string
  children: ReactNode
  color?: string
  containerProps?: ViewProps
  containerStyle?: StyleProp<ViewStyle>
  hideText?: boolean
  isPrivate?: boolean
  muted?: boolean
  outline?: boolean
  radius?: number
  small?: boolean
  textColor?: string
  textProps?: TextProps
}

export const hiddenLabelSize = { width: 10, height: 10 }

export function Label(props: LabelProps) {
  const theme = useTheme()

  const {
    backgroundThemeColor = 'backgroundColor',
    borderColor: _borderColor,
    children,
    color: _color,
    containerProps = {},
    containerStyle,
    hideText,
    isPrivate,
    muted,
    outline,
    radius,
    small,
    textColor: _textColor,
    textProps = {},
  } = props

  const color = _color || theme.foregroundColorMuted50

  const circleColor = getReadableColor(color, theme[backgroundThemeColor], 0.3)

  const backgroundColor = outline
    ? undefined
    : hideText
    ? circleColor
    : theme[backgroundThemeColor]

  const foregroundColor =
    _textColor ||
    (backgroundColor
      ? getReadableColor(backgroundColor, backgroundColor, 0.4)
      : getReadableColor(color, theme[backgroundThemeColor], 0.4))

  const borderColor =
    _borderColor ||
    (outline
      ? foregroundColor
      : hideText
      ? theme[backgroundThemeColor]
      : backgroundColor)

  const width = hideText ? hiddenLabelSize.width : undefined
  const height = hideText ? hiddenLabelSize.height : small ? 16 : 18

  return (
    <SpringAnimatedView
      {...containerProps}
      style={[
        hideText ? { width } : { minWidth: width },
        {
          height,
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: typeof radius === 'number' ? radius : height / 2,
          borderWidth: StyleSheet.hairlineWidth,
        },
        containerProps && containerProps.style,
        containerStyle,
        {
          borderColor,
          backgroundColor,
        },
        muted && { opacity: mutedOpacity },
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      {!hideText && (
        <>
          {/* <Spacer width={contentPadding / (small ? 3 : 2)} /> */}
          <SpringAnimatedView
            style={{
              width: 6,
              height: 6,
              borderRadius: 6 / 2,
              backgroundColor: circleColor,
            }}
          />
        </>
      )}

      <SpringAnimatedText
        numberOfLines={1}
        {...textProps}
        style={[
          hideText ? { width } : { minWidth: width },
          {
            height,
            lineHeight: hideText ? height : height - 2,
            fontSize: hideText ? 0 : small ? 11 : 12,
            color: foregroundColor,
            paddingHorizontal: hideText ? 0 : contentPadding / (small ? 3 : 2),
          },
          textProps && !hideText && textProps.style,
        ]}
        {...!!hideText &&
          Platform.select({
            web: {
              title: children && typeof children === 'string' ? children : null,
            },
          })}
      >
        {!!(isPrivate && !hideText) && (
          <Text>
            <SpringAnimatedIcon
              name="lock"
              style={{ color: foregroundColor }}
            />{' '}
          </Text>
        )}
        {hideText
          ? ''
          : typeof children === 'string'
          ? parseTextWithEmojisToReactComponents(children, {
              key: `label-text-${children}`,
              imageProps: {
                style: {
                  marginHorizontal: 2,
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
