import React from 'react'
import {
  Animated,
  StyleSheet,
  TextProps,
  TouchableOpacityProps,
  View,
} from 'react-native'

import { AnimatedActivityIndicator } from '../../components/animated/AnimatedActivityIndicator'
import { AnimatedIcon } from '../../components/animated/AnimatedIcon'
import { AnimatedTouchableOpacity } from '../../components/animated/AnimatedTouchableOpacity'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'

export interface GitHubLoginButtonProps extends TouchableOpacityProps {
  horizontal?: boolean
  leftIcon?: string
  loading?: boolean
  rightIcon?: string
  subtitle?: string
  subtitleProps?: TextProps
  textProps?: TextProps
  title?: string
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 58 / 2,
    height: 58,
  },

  content: {
    flex: 1,
    flexDirection: 'row',
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

  const theme = useAnimatedTheme()

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.9}
      {...otherProps}
      style={[
        styles.button,
        {
          backgroundColor: theme.backgroundColorLess08,
          borderColor: theme.backgroundColor,
        },
        props.style,
      ]}
    >
      <View style={styles.content}>
        {Boolean(leftIcon) && (
          <Animated.View
            style={[
              styles.iconWrapper,
              {
                borderColor: theme.foregroundColor,
                paddingLeft: contentPadding,
              },
            ]}
          >
            <AnimatedIcon
              color={theme.foregroundColor}
              name={leftIcon!}
              style={styles.icon}
            />
          </Animated.View>
        )}

        <View style={styles.mainContentContainer}>
          {Boolean(title) && (
            <Animated.Text
              {...textProps}
              style={[
                styles.title,
                {
                  color: theme.foregroundColor,
                },
                textProps.style,
              ]}
            >
              {title}
            </Animated.Text>
          )}

          {Boolean(subtitle) && (
            <Animated.Text
              {...subtitleProps}
              style={[
                styles.subtitleText,
                {
                  color: theme.foregroundColorMuted50,
                },
                subtitleProps.style,
              ]}
            >
              {subtitle}
            </Animated.Text>
          )}
        </View>

        {Boolean(rightIcon || loading) && (
          <View style={[styles.iconWrapper, { paddingRight: contentPadding }]}>
            {loading ? (
              <AnimatedActivityIndicator color={theme.foregroundColor} />
            ) : (
              <AnimatedIcon
                color={theme.foregroundColor}
                name={rightIcon!}
                style={styles.icon}
              />
            )}
          </View>
        )}
      </View>
    </AnimatedTouchableOpacity>
  )
}
