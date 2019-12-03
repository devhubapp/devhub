import { Theme, ThemeColors } from '@devhub/core'
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

import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  fixColorHexWithoutHash,
  getReadableColor,
} from '../../utils/helpers/colors'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import { Spacer } from './Spacer'

export interface LabelProps {
  backgroundThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  borderThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  children: ReactNode
  colorThemeColor?: string | keyof ThemeColors | ((theme: Theme) => string)
  containerProps?: ViewProps
  containerStyle?: StyleProp<ViewStyle>
  disableEmojis?: boolean
  hideText?: boolean
  muted?: boolean
  outline?: boolean
  radius?: number
  small?: boolean
  textProps?: TextProps
  textThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
  transparent?: boolean
  tryFixingColorHexWithoutHash?: boolean
}

export const hiddenLabelSizes = { width: 10, height: 10 }
export const smallLabelHeight = 16
export const normalLabelHeight = 18

const styles = StyleSheet.create({
  dot: {
    width: 6,
    height: 6,
    marginTop: 1,
    borderRadius: 6 / 2,
  },
})

export const Label = React.memo((props: LabelProps) => {
  const theme = useTheme()

  const {
    backgroundThemeColor: _backgroundThemeColor = 'backgroundColor',
    borderThemeColor: _borderThemeColor,
    children,
    colorThemeColor: _colorThemeColor,
    containerProps = {},
    containerStyle,
    disableEmojis,
    hideText,
    muted,
    outline,
    radius,
    small,
    textProps = {},
    textThemeColor: _textThemeColor,
    transparent,
    tryFixingColorHexWithoutHash,
  } = props

  const backgroundThemeColor = getThemeColorOrItself(
    theme,
    _backgroundThemeColor,
  )!
  const borderThemeColor = getThemeColorOrItself(theme, _borderThemeColor)
  const textThemeColor = getThemeColorOrItself(theme, _textThemeColor)

  const _color =
    getThemeColorOrItself(theme, _colorThemeColor) ||
    theme.foregroundColorMuted65
  const color = tryFixingColorHexWithoutHash
    ? _color && _color === _colorThemeColor
      ? fixColorHexWithoutHash(_color)
      : _color
    : _color

  const circleColor = getReadableColor(color, backgroundThemeColor, 0.3)

  const backgroundColor =
    outline || transparent
      ? undefined
      : hideText
      ? circleColor
      : backgroundThemeColor

  const foregroundColor =
    textThemeColor ||
    (backgroundColor || transparent
      ? getReadableColor(
          backgroundColor || backgroundThemeColor,
          backgroundColor || backgroundThemeColor,
          0.4,
        )
      : getReadableColor(color, backgroundThemeColor, 0.4))

  const borderColor =
    borderThemeColor ||
    (outline
      ? foregroundColor
      : hideText
      ? backgroundThemeColor
      : backgroundColor)

  const width = hideText ? hiddenLabelSizes.width : undefined
  const height = hideText
    ? hiddenLabelSizes.height
    : small
    ? smallLabelHeight
    : normalLabelHeight

  return (
    <View
      {...containerProps}
      style={[
        sharedStyles.horizontal,
        sharedStyles.center,
        hideText ? { width } : { minWidth: width },
        {
          height,
          borderRadius: typeof radius === 'number' ? radius : height / 2,
          borderWidth: outline ? 1 : 0,
        },
        containerProps && containerProps.style,
        containerStyle,
        {
          borderColor,
          backgroundColor,
        },
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      {!hideText && (
        <>
          {/* <Spacer width={contentPadding / (small ? 3 : 2)} /> */}
          <View
            style={[
              styles.dot,
              {
                backgroundColor: circleColor,
              },
              muted && sharedStyles.muted,
            ]}
          />
        </>
      )}

      {hideText ? null : typeof children === 'string' ? (
        <Text
          numberOfLines={1}
          {...textProps}
          style={[
            hideText ? { width } : { minWidth: width },
            {
              height,
              lineHeight: height,
              fontSize: hideText ? 0 : small ? 11 : 12,
              color: foregroundColor,
              paddingLeft: hideText ? 0 : contentPadding / (small ? 3 : 2),
            },
            textProps && !hideText && textProps.style,
          ]}
          {...(!!hideText &&
            Platform.select({
              web: {
                title:
                  children && typeof children === 'string' ? children : null,
              },
            }))}
        >
          {parseTextWithEmojisToReactComponents(children, {
            key: `label-text-${children}`,
            imageProps: {
              style: {
                marginHorizontal: 2,
                width: small ? 13 : 14,
                height: small ? 13 : 14,
              },
            },
            shouldStripEmojis: disableEmojis,
          })}
        </Text>
      ) : (
        <>
          <Spacer width={contentPadding / (small ? 3 : 2)} />
          {children}
        </>
      )}
    </View>
  )
})
