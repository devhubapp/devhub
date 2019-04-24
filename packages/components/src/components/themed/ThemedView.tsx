import React, { RefObject, useCallback, useRef } from 'react'
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native'

import { Omit, ThemeColors } from '@devhub/core'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from './helpers'

export interface ThemedViewProps extends Omit<ViewProps, 'style'> {
  backgroundColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  borderColor?: keyof ThemeColors | ((theme: ThemeColors) => string)
  children?: React.ReactNode
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor' | 'borderColor'>>
}

export const ThemedView = React.forwardRef<View, ThemedViewProps>(
  (props, receivedRef: any) => {
    const { backgroundColor, borderColor, style, ...otherProps } = props

    const fallbackRef = useRef<View>(null)
    const ref = receivedRef || fallbackRef

    const initialTheme = useTheme(
      useCallback(
        theme => {
          updateStyle(ref, theme, { backgroundColor, borderColor })
        },
        [backgroundColor, borderColor],
      ),
    )

    return (
      <View
        {...otherProps}
        ref={ref}
        style={[
          style,
          getStyle(initialTheme, { backgroundColor, borderColor }),
        ]}
      />
    )
  },
)

function getStyle(
  theme: ThemeColors,
  {
    backgroundColor: _backgroundColor,
    borderColor: _borderColor,
  }: Pick<ThemedViewProps, 'backgroundColor' | 'borderColor'>,
) {
  const backgroundColor = getThemeColorOrItself(theme, _backgroundColor, {
    enableCSSVariable: true,
  })
  const borderColor = getThemeColorOrItself(theme, _borderColor, {
    enableCSSVariable: true,
  })

  const style: ViewStyle = {}
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (borderColor) style.borderColor = borderColor

  return style
}

function updateStyle(
  ref: RefObject<View> | null,
  theme: ThemeColors,
  {
    backgroundColor,
    borderColor,
  }: Pick<ThemedViewProps, 'backgroundColor' | 'borderColor'>,
) {
  if (!(ref && ref.current)) return

  ref.current.setNativeProps({
    style: getStyle(theme, { backgroundColor, borderColor }),
  })
}
