import { rgba } from 'polished'
import React, { useRef } from 'react'
import { ViewProps } from 'react-native'
import { useSpring } from 'react-spring/native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
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
import { separatorSize } from './Separator'

export const defaultButtonSize = 36

export interface ButtonProps extends SpringAnimatedTouchableOpacityProps {
  backgroundColor?: string
  borderOnly?: boolean
  children: string | React.ReactNode
  contentContainerStyle?: ViewProps['style']
  disabled?: boolean
  foregroundColor?: string
  hoverBackgroundColor?: string
  hoverForegroundColor?: string
  loading?: boolean
  loadingIndicatorStyle?: SpringAnimatedActivityIndicatorProps['style']
  onPress: SpringAnimatedTouchableOpacityProps['onPress']
  size?: number | null
}

export const Button = React.memo((props: ButtonProps) => {
  const {
    backgroundColor,
    borderOnly,
    children,
    contentContainerStyle,
    disabled,
    foregroundColor,
    hoverBackgroundColor,
    hoverForegroundColor,
    loading,
    loadingIndicatorStyle,
    size: _size,
    style,
    ...otherProps
  } = props

  const size =
    typeof _size === 'number' || _size === null
      ? _size || undefined
      : defaultButtonSize

  const initialTheme = useTheme(theme => {
    cacheRef.current.theme = theme
    updateStyles()
  })

  const touchableRef = useRef(null)
  const initialIsHovered = useHover(touchableRef, isHovered => {
    cacheRef.current.isHovered = isHovered
    updateStyles()
  })

  const cacheRef = useRef({
    isHovered: initialIsHovered,
    isPressing: false,
    theme: initialTheme,
  })

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring<
    ReturnType<typeof getStyles>
  >(getStyles)

  function getStyles() {
    const { isHovered, isPressing, theme } = cacheRef.current

    const immediate = isHovered || Platform.realOS === 'android'

    return {
      config: { duration: immediate ? 0 : 100 },
      immediate,
      activityIndicatorColor: theme.foregroundColor,
      touchableBorderColor: backgroundColor
        ? backgroundColor
        : isHovered || isPressing
        ? hoverBackgroundColor || theme.backgroundColorLess3
        : theme.backgroundColorLess2,
      innerContainerBackgroundColor: borderOnly
        ? rgba(theme.backgroundColorLess2, 0)
        : isHovered || isPressing
        ? hoverBackgroundColor ||
          (backgroundColor
            ? theme.backgroundColorTransparent10
            : theme.backgroundColorLess3)
        : rgba(theme.backgroundColorLess2, 0),
      textColor: foregroundColor
        ? foregroundColor
        : borderOnly
        ? isHovered || isPressing
          ? hoverForegroundColor || theme.foregroundColor
          : theme.foregroundColorMuted50
        : theme.foregroundColor,
    }
  }

  function updateStyles() {
    setSpringAnimatedStyles(getStyles())
  }

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      {...otherProps}
      onPressIn={() => {
        if (Platform.realOS === 'web') return

        cacheRef.current.isPressing = true
        updateStyles()
      }}
      onPressOut={() => {
        if (Platform.realOS === 'web') return

        cacheRef.current.isPressing = false
        updateStyles()
      }}
      style={[
        {
          height: size,
          backgroundColor: borderOnly
            ? 'transparent'
            : backgroundColor
            ? backgroundColor
            : springAnimatedTheme.backgroundColorLess2,
          borderColor: springAnimatedStyles.touchableBorderColor,
          borderWidth: borderOnly ? separatorSize : 0,
          borderRadius: (size || defaultButtonSize) / 2,
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
            borderRadius: (size || defaultButtonSize) / 2,
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
              lineHeight: Platform.select({ web: 14 }),
              fontSize: 14,
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
