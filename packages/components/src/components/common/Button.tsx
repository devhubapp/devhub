import { ThemeColors } from '@devhub/core'
import React, { useCallback, useRef, useState } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import { normalTextSize, radius } from '../../styles/variables'
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
  children:
    | React.ReactNode
    | ((colors: { foregroundThemeColor: keyof ThemeColors }) => React.ReactNode)
  contentContainerStyle?: ViewProps['style']
  loading?: boolean
  loadingIndicatorStyle?: ThemedActivityIndicatorProps['style']
  round?: boolean
  size?: number | 'auto'
  textStyle?: ThemedTextProps['style']
} & (
    | {
        type?: 'primary' | 'neutral' | 'danger' | 'transparent'
        colors?: undefined
      }
    | {
        type: 'custom'
        colors: ReturnType<typeof getButtonColors>
      })

export const defaultButtonSize = 40

export function Button(props: ButtonProps) {
  const {
    children,
    colors,
    contentContainerStyle,
    loading,
    loadingIndicatorStyle,
    round = true,
    size = defaultButtonSize,
    style,
    textStyle,
    type = 'neutral',
    ...otherProps
  } = props

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
  } = type === 'custom' ? colors! : getButtonColors(type)

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

  return (
    <ThemedView
      ref={containerViewRef}
      backgroundColor={backgroundThemeColor}
      style={[
        sharedStyles.relative,
        !otherProps.hitSlop && sharedStyles.overflowHidden,
        typeof size === 'number' && { minWidth: size },
        { height: size },
        round && { borderRadius: size === 'auto' ? radius : size / 2 },
        style,
      ]}
    >
      <>
        <ThemedTouchableHighlight
          ref={innerTouchableRef}
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
): {
  backgroundThemeColor: keyof ThemeColors
  foregroundThemeColor: keyof ThemeColors
  backgroundHoverThemeColor: keyof ThemeColors | undefined
  foregroundHoverThemeColor: keyof ThemeColors
} {
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
      }
  }
}

const styles = StyleSheet.create({
  text: {
    lineHeight: normalTextSize + 4,
    fontSize: normalTextSize,
    fontWeight: '600',
    textAlign: 'center',
  },
})
