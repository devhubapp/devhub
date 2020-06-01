import { ThemeColors } from '@devhub/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { normalTextSize, radius, scaleFactor } from '../../styles/variables'
import { getTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'
import {
  ThemedActivityIndicator,
  ThemedActivityIndicatorProps,
} from '../themed/ThemedActivityIndicator'
import { ThemedText, ThemedTextProps } from '../themed/ThemedText'
import {
  ThemedTouchableHighlight,
  ThemedTouchableHighlightProps,
} from '../themed/ThemedTouchableHighlight'
import { ThemedView } from '../themed/ThemedView'

export type ButtonProps = Omit<ThemedTouchableHighlightProps, 'children'> & {
  autoFocus?: boolean
  children:
    | React.ReactNode
    | ((colors: { foregroundThemeColor: keyof ThemeColors }) => React.ReactNode)
  contentContainerStyle?: ViewProps['style']
  loading?: boolean
  loadingIndicatorStyle?: ThemedActivityIndicatorProps['style']
  round?: boolean
  size?: number | 'auto'
  textStyle?: ThemedTextProps['style']
  withBorder?: boolean
} & (
    | {
        type?: 'primary' | 'neutral' | 'danger' | 'transparent'
        colors?: {
          backgroundThemeColor?: keyof ThemeColors
          foregroundThemeColor?: keyof ThemeColors
          backgroundHoverThemeColor?: keyof ThemeColors | undefined
          foregroundHoverThemeColor?: keyof ThemeColors
        }
      }
    | {
        type: 'custom'
        colors: {
          backgroundThemeColor: keyof ThemeColors
          foregroundThemeColor: keyof ThemeColors
          backgroundHoverThemeColor: keyof ThemeColors | undefined
          foregroundHoverThemeColor: keyof ThemeColors
        }
      })

export const defaultButtonSize = 40 * scaleFactor

export function Button(props: ButtonProps) {
  const {
    autoFocus,
    children,
    colors,
    contentContainerStyle,
    loading,
    loadingIndicatorStyle,
    round = true,
    style,
    textStyle,
    type = 'neutral',
    withBorder,
    ...otherProps
  } = props

  const _size = props.size || defaultButtonSize
  const size = typeof _size === 'number' ? _size - (withBorder ? 1 : 0) : _size

  const containerViewRef = useRef<View>(null)
  const innerTouchableRef = useRef<ThemedTouchableHighlight>(null)
  const textRef = useRef<ThemedText>(null)

  const [_colors, _setColors] = useState<{
    foregroundThemeColor: keyof ThemeColors
  }>()

  const {
    backgroundThemeColor,
    foregroundThemeColor,
    backgroundHoverThemeColor,
    foregroundHoverThemeColor,
  } = getButtonColors(type, colors)

  useHover(
    containerViewRef,
    useCallback(
      isHovered => {
        const theme = getTheme()

        const _backgroundThemeColor: keyof ThemeColors = isHovered
          ? backgroundHoverThemeColor
            ? backgroundHoverThemeColor
            : theme.isDark
            ? 'backgroundColorTransparent10'
            : 'foregroundColorTransparent10'
          : 'transparent'

        const _foregroundThemeColor: keyof ThemeColors =
          isHovered && foregroundHoverThemeColor
            ? foregroundHoverThemeColor
            : foregroundThemeColor || 'foregroundColor'
        if (innerTouchableRef.current) {
          innerTouchableRef.current.setNativeProps({
            style: {
              backgroundColor: getThemeColorOrItself(
                theme,
                _backgroundThemeColor,
                {
                  enableCSSVariable: true,
                },
              ),
            },
          })
        }

        if (textRef.current) {
          textRef.current.setNativeProps({
            style: {
              color: getThemeColorOrItself(theme, _foregroundThemeColor, {
                enableCSSVariable: true,
              }),
            },
          })
        }

        if (typeof children === 'function')
          _setColors({ foregroundThemeColor: _foregroundThemeColor })
      },
      [
        backgroundThemeColor,
        foregroundThemeColor,
        backgroundHoverThemeColor,
        foregroundHoverThemeColor,
        typeof children === 'function',
      ],
    ),
  )

  useEffect(() => {
    if (autoFocus && innerTouchableRef.current)
      innerTouchableRef.current.focus()
  }, [autoFocus])

  return (
    <ThemedView
      ref={containerViewRef}
      backgroundColor={backgroundThemeColor}
      borderColor={
        !backgroundThemeColor || backgroundThemeColor === 'transparent'
          ? backgroundHoverThemeColor
          : backgroundThemeColor
      }
      style={[
        styles.button,
        !otherProps.hitSlop && sharedStyles.overflowHidden,
        { minWidth: size, height: size },
        round && { borderRadius: size === 'auto' ? radius : size / 2 },
        withBorder && { borderWidth: 1 },
        style,
      ]}
    >
      <>
        <ThemedTouchableHighlight
          ref={innerTouchableRef}
          accessibilityRole="button"
          backgroundColor={undefined}
          underlayColor={backgroundHoverThemeColor}
          {...otherProps}
          style={[
            sharedStyles.fullWidth,
            sharedStyles.fullHeight,
            round && { borderRadius: size === 'auto' ? radius : size / 2 },
            loading && sharedStyles.opacity0,
          ]}
        >
          <View
            style={[
              sharedStyles.center,
              sharedStyles.fullWidth,
              sharedStyles.fullHeight,
              size === 'auto' && sharedStyles.paddingVertical,
              sharedStyles.paddingHorizontal,
              round && { borderRadius: size === 'auto' ? radius : size / 2 },
              contentContainerStyle,
            ]}
          >
            {typeof children === 'string' ? (
              <ThemedText
                ref={textRef}
                color={foregroundThemeColor}
                style={[
                  styles.text,
                  Platform.OS === 'web' &&
                    typeof size === 'number' && {
                      lineHeight: size,
                    },
                  textStyle,
                ]}
              >
                {children}
              </ThemedText>
            ) : typeof children === 'function' ? (
              children(
                _colors || {
                  foregroundThemeColor:
                    foregroundThemeColor || 'foregroundColor',
                },
              )
            ) : (
              children
            )}
          </View>
        </ThemedTouchableHighlight>

        {!!loading && (
          <View
            style={[StyleSheet.absoluteFill, sharedStyles.center]}
            pointerEvents="none"
          >
            <ThemedActivityIndicator
              color={foregroundThemeColor}
              size="small"
              style={loadingIndicatorStyle}
            />
          </View>
        )}
      </>
    </ThemedView>
  )
}

export function getButtonColors(
  type?: ButtonProps['type'],
  override?: ButtonProps['colors'],
): NonNullable<ButtonProps['colors']> {
  switch (type) {
    case 'danger':
      return {
        backgroundThemeColor: 'backgroundColorLess1',
        foregroundThemeColor: 'foregroundColor',
        backgroundHoverThemeColor: 'red',
        foregroundHoverThemeColor: 'white',
      }

    case 'primary':
      return {
        backgroundThemeColor: 'primaryBackgroundColor',
        foregroundThemeColor: 'primaryForegroundColor',
        backgroundHoverThemeColor: undefined,
        foregroundHoverThemeColor: 'primaryForegroundColor',
      }

    case 'transparent':
      return {
        backgroundThemeColor: 'transparent',
        foregroundThemeColor: 'foregroundColor',
        backgroundHoverThemeColor: 'backgroundColorLess1',
        foregroundHoverThemeColor: 'foregroundColor',
      }

    default:
      return {
        backgroundThemeColor: 'backgroundColorLess1',
        foregroundThemeColor: 'foregroundColor',
        backgroundHoverThemeColor: 'backgroundColorLess2',
        foregroundHoverThemeColor: 'foregroundColor',
        ...override,
      }
  }
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
  },

  text: {
    lineHeight: normalTextSize + 4 * scaleFactor,
    fontSize: normalTextSize,
    fontWeight: '600',
    textAlign: 'center',
  },
})
