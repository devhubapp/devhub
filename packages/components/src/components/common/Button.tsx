import { getLuminance, rgba } from 'polished'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { ViewProps } from 'react-native'
import { AnimatedValue, useSpring } from 'react-spring/native'

import { constants, ThemeColors } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import { getDefaultReactSpringAnimationConfig } from '../../utils/helpers/animations'
import {
  SpringAnimatedActivityIndicator,
  SpringAnimatedActivityIndicatorProps,
} from '../animated/spring/SpringAnimatedActivityIndicator'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'
import { getThemeColorOrItself } from '../themed/helpers'

export const defaultButtonSize = 40

export interface ButtonProps extends SpringAnimatedTouchableOpacityProps {
  backgroundThemeColor?: keyof ThemeColors
  children:
    | string
    | React.ReactNode
    | ((params: {
        springAnimatedStyles: AnimatedValue<{
          touchableBackgroundColor: string
          touchableBorderColor: string
          innerContainerBackgroundColor: string
          textColor: string
        }>
      }) => React.ReactNode)
  contentContainerStyle?: ViewProps['style']
  disabled?: boolean
  fontSize?: number
  foregroundThemeColor?: keyof ThemeColors
  hoverBackgroundThemeColor?: keyof ThemeColors
  hoverForegroundThemeColor?: keyof ThemeColors
  loading?: boolean
  loadingIndicatorStyle?: SpringAnimatedActivityIndicatorProps['style']
  onPress: SpringAnimatedTouchableOpacityProps['onPress']
  round?: boolean
  showBorder?: boolean
  size?: number | null
  transparent?: boolean
}

export const Button = React.memo((props: ButtonProps) => {
  const {
    backgroundThemeColor,
    children,
    contentContainerStyle,
    disabled,
    fontSize,
    foregroundThemeColor,
    hoverBackgroundThemeColor,
    hoverForegroundThemeColor,
    loading,
    loadingIndicatorStyle,
    round = true,
    showBorder,
    size: _size,
    style,
    transparent,
    ...otherProps
  } = props

  const size =
    typeof _size === 'number' || _size === null
      ? _size || undefined
      : defaultButtonSize

  const cacheRef = useRef({
    isHovered: false,
    isPressing: false,
  })

  const theme = useTheme()

  const getStyles = useCallback(
    ({ forceImmediate }: { forceImmediate: boolean }) => {
      const { isHovered: _isHovered, isPressing } = cacheRef.current

      const isHovered = _isHovered && !disabled

      const immediate =
        forceImmediate || constants.DISABLE_ANIMATIONS || Platform.supportsTouch

      const backgroundColor = getThemeColorOrItself(
        theme,
        backgroundThemeColor || 'backgroundColorLess1',
      )!
      const hoverBackgroundColor = getThemeColorOrItself(
        theme,
        hoverBackgroundThemeColor ||
          (transparent && backgroundThemeColor) ||
          (!backgroundThemeColor && 'backgroundColorLess2') ||
          undefined,
      )
      const foregroundColor =
        (!transparent &&
          `${backgroundColor}`.toLowerCase() ===
            `${theme.primaryBackgroundColor}`.toLowerCase() &&
          theme.primaryForegroundColor) ||
        (foregroundThemeColor &&
          getThemeColorOrItself(theme, foregroundThemeColor)) ||
        (transparent
          ? Math.abs(
              getLuminance(backgroundColor) -
                getLuminance(theme.foregroundColor),
            ) <= 0.5
            ? backgroundColor
            : isHovered || isPressing
            ? theme.foregroundColor
            : theme.foregroundColorMuted65
          : theme.foregroundColor)

      const hoverForegroundColor =
        (`${hoverBackgroundColor ||
          (transparent && backgroundColor) ||
          ''}`.toLowerCase() ===
          `${theme.primaryBackgroundColor}`.toLowerCase() &&
          theme.primaryForegroundColor) ||
        (hoverForegroundThemeColor &&
          getThemeColorOrItself(theme, hoverForegroundThemeColor)) ||
        foregroundColor

      const textColor =
        isHovered || isPressing ? hoverForegroundColor : foregroundColor

      return {
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        touchableBackgroundColor: transparent
          ? isHovered || isPressing
            ? backgroundColor
            : rgba(backgroundColor, 0)
          : backgroundColor,
        touchableBorderColor:
          isHovered || isPressing
            ? hoverBackgroundColor || backgroundColor
            : backgroundColor,
        innerContainerBackgroundColor:
          isHovered || isPressing
            ? hoverBackgroundColor ||
              (transparent ? rgba(backgroundColor, 0) : rgba(textColor, 0.1))
            : rgba(
                transparent
                  ? hoverBackgroundColor || backgroundColor
                  : backgroundColor,
                0,
              ),
        textColor,
      }
    },
    [
      backgroundThemeColor,
      disabled,
      foregroundThemeColor,
      hoverBackgroundThemeColor,
      hoverForegroundThemeColor,
      showBorder,
      theme,
      transparent,
    ],
  )

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring<
    ReturnType<typeof getStyles>
  >(() => getStyles({ forceImmediate: true }))

  const updateStyles = useCallback(
    ({ forceImmediate }: { forceImmediate: boolean }) => {
      setSpringAnimatedStyles(getStyles({ forceImmediate }))
    },
    [getStyles],
  )

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(touchableRef, isHovered => {
    if (cacheRef.current.isHovered === isHovered) return
    cacheRef.current.isHovered = isHovered
    updateStyles({ forceImmediate: false })
  })
  cacheRef.current.isHovered = initialIsHovered

  const isFirstRendeRef = useRef(true)
  useLayoutEffect(() => {
    if (isFirstRendeRef.current) {
      isFirstRendeRef.current = false
      return
    }

    updateStyles({ forceImmediate: true })
  }, [updateStyles])

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      {...otherProps}
      activeOpacity={Platform.supportsTouch ? 1 : otherProps.activeOpacity}
      disabled={disabled}
      onPressIn={() => {
        if (!Platform.supportsTouch) return

        cacheRef.current.isPressing = true
        updateStyles({ forceImmediate: true })
      }}
      onPressOut={() => {
        if (!Platform.supportsTouch) return

        cacheRef.current.isPressing = false
        updateStyles({ forceImmediate: true })
      }}
      style={[
        {
          height: size,
          backgroundColor: springAnimatedStyles.touchableBackgroundColor,
          borderColor: springAnimatedStyles.touchableBorderColor,
          borderWidth: showBorder ? 1 : 0,
          borderRadius: round ? (size || defaultButtonSize) / 2 : 0,
        },
        style,
      ]}
    >
      <SpringAnimatedView
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: size,
            paddingHorizontal: contentPadding,
            backgroundColor: springAnimatedStyles.innerContainerBackgroundColor,
            borderWidth: 0,
            borderRadius: round ? (size || defaultButtonSize) / 2 : 0,
          },
          contentContainerStyle,
        ]}
      >
        {loading ? (
          <SpringAnimatedActivityIndicator
            color={springAnimatedStyles.textColor}
            size="small"
            style={loadingIndicatorStyle}
          />
        ) : typeof children === 'string' ? (
          <SpringAnimatedText
            style={{
              lineHeight: Platform.select({ web: fontSize }),
              fontSize,
              fontWeight: '500',
              color: springAnimatedStyles.textColor,
            }}
          >
            {children}
          </SpringAnimatedText>
        ) : typeof children === 'function' ? (
          children({ springAnimatedStyles })
        ) : (
          children
        )}
      </SpringAnimatedView>
    </SpringAnimatedTouchableOpacity>
  )
})

Button.displayName = 'Button'
