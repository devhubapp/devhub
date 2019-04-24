import React, { ReactNode } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { ThemeColors } from '@devhub/core'
import { Platform } from '../../libs/platform'
import { contentPadding, mutedOpacity } from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export interface LabelProps {
  backgroundThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children: ReactNode
  color?: string
  containerProps?: ViewProps
  containerStyle?: StyleProp<ViewStyle>
  enableEmojis?: boolean
  hideText?: boolean
  muted?: boolean
  outline?: boolean
  radius?: number
  small?: boolean
  textProps?: TextProps
  textThemeColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
}

export const hiddenLabelSize = { width: 10, height: 10 }

export function Label(props: LabelProps) {
  const theme = useTheme()

  const {
    backgroundThemeColor: _backgroundThemeColor = 'backgroundColor',
    borderThemeColor: _borderThemeColor,
    textThemeColor: _textThemeColor,
    children,
    color: _color,
    containerProps = {},
    containerStyle,
    enableEmojis,
    hideText,
    muted,
    outline,
    radius,
    small,
    textProps = {},
  } = props

  const backgroundThemeColor = getThemeColorOrItself(
    theme,
    _backgroundThemeColor,
  )!
  const borderThemeColor = getThemeColorOrItself(theme, _borderThemeColor)
  const textThemeColor = getThemeColorOrItself(theme, _textThemeColor)

  const color = _color || theme.foregroundColorMuted50

  const circleColor = getReadableColor(color, backgroundThemeColor, 0.3)

  const backgroundColor = outline
    ? undefined
    : hideText
    ? circleColor
    : backgroundThemeColor

  const foregroundColor =
    textThemeColor ||
    (backgroundColor
      ? getReadableColor(backgroundColor, backgroundColor, 0.4)
      : getReadableColor(color, backgroundThemeColor, 0.4))

  const borderColor =
    borderThemeColor ||
    (outline
      ? foregroundColor
      : hideText
      ? backgroundThemeColor
      : backgroundColor)

  const width = hideText ? hiddenLabelSize.width : undefined
  const height = hideText ? hiddenLabelSize.height : small ? 16 : 18

  return (
    <View
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
        Boolean(radius) && { borderRadius: radius },
        muted && hideText && { opacity: mutedOpacity },
      ]}
    >
      {!hideText && (
        <>
          {/* <Spacer width={contentPadding / (small ? 3 : 2)} /> */}
          <View
            style={[
              {
                width: 6,
                height: 6,
                borderRadius: 6 / 2,
                backgroundColor: circleColor,
              },
              muted && { opacity: mutedOpacity },
            ]}
          />
        </>
      )}

      <Text
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
        {hideText
          ? ''
          : typeof children === 'string'
          ? parseTextWithEmojisToReactComponents(children, {
              key: `label-text-${children}`,
              imageProps: {
                style: enableEmojis
                  ? {
                      marginHorizontal: 2,
                      width: small ? 13 : 14,
                      height: small ? 13 : 14,
                    }
                  : {
                      marginHorizontal: 0,
                      width: 0,
                      height: 0,
                    },
              },
            })
          : children}
      </Text>
    </View>
  )
}
