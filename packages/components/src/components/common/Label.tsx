import { Theme, ThemeColors } from '@devhub/core'
import React, { ReactNode } from 'react'
import {
  StyleProp,
  Text,
  TextProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { parseTextWithEmojisToReactComponents } from '../../utils/helpers/github/emojis'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export interface LabelProps {
  children:
    | string
    | ((labelColors: {
        backgroundColor: string
        foregroundColor: string
      }) => ReactNode)
  colorThemeColor?: string | keyof ThemeColors | ((theme: Theme) => string)
  containerProps?: ViewProps
  containerStyle?: StyleProp<ViewStyle>
  disableEmojis?: boolean
  muted?: boolean
  radius?: number
  small?: boolean
  textProps?: TextProps
  textThemeColor?: keyof ThemeColors | ((theme: Theme) => string)
}

export const smallLabelHeight = Platform.OS === 'web' ? 16 : 18
export const normalLabelHeight = Platform.OS === 'web' ? 18 : 20

export const Label = React.memo((props: LabelProps) => {
  const theme = useTheme()

  const {
    children,
    colorThemeColor: _colorThemeColor,
    containerProps = {},
    containerStyle,
    disableEmojis,
    radius,
    small,
    textProps = {},
  } = props

  const backgroundColor =
    getThemeColorOrItself(theme, _colorThemeColor) || theme.foregroundColor

  const foregroundColor =
    backgroundColor && backgroundColor !== 'transparent'
      ? getReadableColor(
          backgroundColor || backgroundColor,
          backgroundColor || backgroundColor,
          0.8,
        )
      : getReadableColor(theme.backgroundColor, backgroundColor, 0.8)

  const height = small ? smallLabelHeight : normalLabelHeight

  return (
    <View
      {...containerProps}
      style={[
        sharedStyles.horizontal,
        sharedStyles.center,
        {
          height,
          borderRadius: typeof radius === 'number' ? radius : height / 2,
          borderWidth: 0,
          backgroundColor,
          paddingHorizontal: (contentPadding / 4) * (small ? 2 : 3),
        },
        containerProps && containerProps.style,
        containerStyle,
        Boolean(radius) && { borderRadius: radius },
      ]}
    >
      {typeof children === 'string' ? (
        <Text
          numberOfLines={1}
          {...textProps}
          style={[
            {
              height,
              lineHeight: height,
              fontSize: small ? 11 : 12,
              color: foregroundColor,
            },
            textProps && textProps.style,
          ]}
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
          {typeof children === 'function'
            ? children({ backgroundColor, foregroundColor })
            : children}
        </>
      )}
    </View>
  )
})
