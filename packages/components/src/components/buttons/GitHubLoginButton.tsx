import { rgba } from 'polished'
import React, { useRef } from 'react'
import { StyleSheet, TextProps, View } from 'react-native'
import { useSpring } from 'react-spring/native-hooks'

import { GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useHover } from '../../hooks/use-hover'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedActivityIndicator } from '../animated/spring/SpringAnimatedActivityIndicator'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import {
  SpringAnimatedTouchableOpacity,
  SpringAnimatedTouchableOpacityProps,
} from '../animated/spring/SpringAnimatedTouchableOpacity'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useTheme } from '../context/ThemeContext'

export interface GitHubLoginButtonProps
  extends SpringAnimatedTouchableOpacityProps {
  horizontal?: boolean
  leftIcon?: GitHubIcon
  loading?: boolean
  rightIcon?: GitHubIcon
  subtitle?: string
  subtitleProps?: TextProps
  textProps?: TextProps
  title?: string
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 58 / 2,
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 58,
    borderRadius: 58 / 2,
  },

  iconWrapper: {
    alignItems: 'center',
    borderWidth: 0,
    justifyContent: 'center',
  },

  icon: {
    fontSize: 20,
  },

  mainContentContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  },

  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'left',
  },

  subtitleText: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'left',
  },
})

export function GitHubLoginButton(props: GitHubLoginButtonProps) {
  const {
    leftIcon = 'mark-github',
    loading = false,
    rightIcon = '',
    subtitle = '',
    subtitleProps = {},
    textProps = {},
    title = '',
    ...otherProps
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

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

  const [springAnimatedStyles, setSpringAnimatedStyles] = useSpring<
    ReturnType<typeof getStyles>
  >(getStyles)

  function getStyles() {
    const { isHovered, isPressing, theme } = cacheRef.current
    return {
      config: { duration: 100 },
      native: true,
      backgroundColor:
        isHovered || isPressing
          ? theme.backgroundColorLess16
          : rgba(theme.backgroundColorLess16, 0),
    }
  }

  function updateStyles() {
    setSpringAnimatedStyles(getStyles())
  }

  return (
    <SpringAnimatedTouchableOpacity
      ref={touchableRef}
      activeOpacity={0.8}
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
        styles.button,
        {
          backgroundColor: springAnimatedTheme.backgroundColorLess08,
        },
        props.style,
      ]}
    >
      <SpringAnimatedView
        style={[styles.contentContainer, springAnimatedStyles]}
      >
        {!!leftIcon && (
          <SpringAnimatedView
            style={[
              styles.iconWrapper,
              {
                borderColor: springAnimatedTheme.foregroundColor,
                paddingLeft: contentPadding,
              },
            ]}
          >
            <SpringAnimatedIcon
              name={leftIcon}
              style={[
                styles.icon,
                { color: springAnimatedTheme.foregroundColor },
              ]}
            />
          </SpringAnimatedView>
        )}

        <View style={styles.mainContentContainer}>
          {!!title && (
            <SpringAnimatedText
              {...textProps}
              style={[
                styles.title,
                {
                  color: springAnimatedTheme.foregroundColor,
                },
                textProps.style,
              ]}
            >
              {title}
            </SpringAnimatedText>
          )}

          {!!subtitle && (
            <SpringAnimatedText
              {...subtitleProps}
              style={[
                styles.subtitleText,
                {
                  color: springAnimatedTheme.foregroundColorMuted50,
                },
                subtitleProps.style,
              ]}
            >
              {subtitle}
            </SpringAnimatedText>
          )}
        </View>

        {!!(rightIcon || loading) && (
          <View style={[styles.iconWrapper, { paddingRight: contentPadding }]}>
            {loading ? (
              <SpringAnimatedActivityIndicator
                color={springAnimatedTheme.foregroundColor as any}
              />
            ) : (
              !!rightIcon && (
                <SpringAnimatedIcon
                  name={rightIcon}
                  style={[
                    styles.icon,
                    {
                      color: springAnimatedTheme.foregroundColor,
                    },
                  ]}
                />
              )
            )}
          </View>
        )}
      </SpringAnimatedView>
    </SpringAnimatedTouchableOpacity>
  )
}
