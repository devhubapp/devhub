import { rgba } from 'polished'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { ViewProps } from 'react-native'
import { useSpring } from 'react-spring/native'

import { constants, ThemeColors } from '@devhub/core'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { defaultTheme } from '../../styles/utils'
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

export const defaultButtonSize = 36

export interface ButtonProps extends SpringAnimatedTouchableOpacityProps {
  backgroundThemeColor?: keyof ThemeColors
  children: string | React.ReactNode
  contentContainerStyle?: ViewProps['style']
  disabled?: boolean
  fontSize?: number
  foregroundColor?: string
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
    foregroundColor,
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
    theme: defaultTheme,
  })

  const getStyles = useCallback(
    ({ forceImmediate }: { forceImmediate: boolean }) => {
      const { isHovered: _isHovered, isPressing, theme } = cacheRef.current

      const isHovered = _isHovered && !disabled

      const immediate =
        forceImmediate || constants.DISABLE_ANIMATIONS || isHovered

      const backgroundColor = getThemeColorOrItself(theme, backgroundThemeColor)
      const hoverBackgroundColor = getThemeColorOrItself(
        theme,
        hoverBackgroundThemeColor,
      )
      const hoverForegroundColor = getThemeColorOrItself(
        theme,
        hoverForegroundThemeColor,
      )

      const textColor =
        isHovered || isPressing
          ? hoverForegroundColor || theme.foregroundColor
          : foregroundColor
          ? foregroundColor
          : transparent
          ? theme.foregroundColorMuted60
          : theme.foregroundColor

      return {
        config: getDefaultReactSpringAnimationConfig(),
        immediate,
        activityIndicatorColor: theme.foregroundColor,
        touchableBackgroundColor: transparent
          ? 'transparent'
          : backgroundColor
          ? backgroundColor
          : theme.backgroundColorLess2,
        touchableBorderColor: backgroundColor
          ? backgroundColor
          : isHovered || isPressing
          ? hoverBackgroundColor || theme.backgroundColorLess3
          : theme.backgroundColorLess2,
        innerContainerBackgroundColor:
          isHovered || isPressing
            ? hoverBackgroundColor ||
              (backgroundColor
                ? rgba(textColor, 0.04)
                : theme.backgroundColorLess3)
            : rgba(theme.backgroundColorLess2, 0),
        textColor,
      }
    },
    [
      backgroundThemeColor,
      cacheRef.current.isHovered,
      cacheRef.current.isPressing,
      cacheRef.current.theme,
      disabled,
      foregroundColor,
      hoverBackgroundThemeColor,
      hoverForegroundThemeColor,
      showBorder,
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

  const initialTheme = useTheme(
    undefined,
    useCallback(
      theme => {
        if (cacheRef.current.theme === theme) return
        cacheRef.current.theme = theme
        updateStyles({ forceImmediate: true })
      },
      [updateStyles],
    ),
  )
  cacheRef.current.theme = initialTheme

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(touchableRef, isHovered => {
    cacheRef.current.isHovered = isHovered
    updateStyles({ forceImmediate: false })
  })
  cacheRef.current.isHovered = initialIsHovered

  useLayoutEffect(() => {
    updateStyles({ forceImmediate: true })
  })

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      {...otherProps}
      disabled={disabled}
      onPressIn={() => {
        if (Platform.realOS === 'web') return

        cacheRef.current.isPressing = true
        updateStyles({ forceImmediate: true })
      }}
      onPressOut={() => {
        if (Platform.realOS === 'web') return

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
            color={springAnimatedStyles.activityIndicatorColor}
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
        ) : (
          children
        )}
      </SpringAnimatedView>
    </SpringAnimatedTouchableOpacity>
  )
})
