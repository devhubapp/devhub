import React, { useRef } from 'react'
import { useSpring } from 'react-spring/native-hooks'

import { rgba } from 'polished'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import * as colors from '../../styles/colors'
import { contentPadding, radius } from '../../styles/variables'
import { SpringAnimatedActivityIndicator } from '../animated/spring/SpringAnimatedActivityIndicator'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export const buttonSize = 40

export interface ButtonProps extends SpringAnimatedTouchableOpacityProps {
  borderOnly?: boolean
  children: string | React.ReactNode
  disabled?: boolean
  loading?: boolean
  onPress: SpringAnimatedTouchableOpacityProps['onPress']
  useBrandColor?: boolean
}

export const Button = React.memo((props: ButtonProps) => {
  const {
    borderOnly,
    children,
    disabled,
    loading,
    style,
    useBrandColor,
    ...otherProps
  } = props

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

    return {
      config: { duration: 100 },
      native: true,
      activityIndicatorColor: theme.foregroundColor,
      touchableBorderColor: useBrandColor
        ? colors.brandBackgroundColor
        : isHovered || isPressing
        ? theme.backgroundColorLess16
        : theme.backgroundColorLess08,
      innerContainerBackgroundColor: borderOnly
        ? rgba(theme.backgroundColorLess08, 0)
        : isHovered || isPressing
        ? useBrandColor
          ? theme.backgroundColorTransparent10
          : theme.backgroundColorLess16
        : rgba(theme.backgroundColorLess08, 0),
      textColor: useBrandColor
        ? colors.brandForegroundColor
        : borderOnly
        ? isHovered || isPressing
          ? theme.foregroundColor
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
          height: buttonSize,
          backgroundColor: borderOnly
            ? 'transparent'
            : useBrandColor
            ? colors.brandBackgroundColor
            : springAnimatedTheme.backgroundColorLess08,
          borderColor: springAnimatedStyles.touchableBorderColor,
          borderWidth: borderOnly ? 1 : 0,
          borderRadius: radius,
        },
        style,
      ]}
    >
      <SpringAnimatedView
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: buttonSize,
          paddingHorizontal: contentPadding,
          backgroundColor: springAnimatedStyles.innerContainerBackgroundColor,
          borderWidth: 0,
          borderRadius: radius,
        }}
      >
        {loading ? (
          <SpringAnimatedActivityIndicator
            color={springAnimatedStyles.activityIndicatorColor}
            size="small"
          />
        ) : typeof children === 'string' ? (
          <SpringAnimatedText
            style={{
              lineHeight: 14,
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
