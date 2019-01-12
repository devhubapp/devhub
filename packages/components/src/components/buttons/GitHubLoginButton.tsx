import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { AnimatedActivityIndicator } from '../../components/animated/AnimatedActivityIndicator'
import { AnimatedIcon } from '../../components/animated/AnimatedIcon'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { contentPadding } from '../../styles/variables'
import { AnimatedText } from '../animated/AnimatedText'
import { AnimatedView } from '../animated/AnimatedView'
import {
  TouchableOpacity,
  TouchableOpacityProps,
} from '../common/TouchableOpacity'

export interface GitHubLoginButtonProps extends TouchableOpacityProps {
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
    <TouchableOpacity
      animated
      activeOpacity={0.9}
      {...otherProps}
      style={[
        styles.button,
        {
          backgroundColor: theme.backgroundColorLess08 as any,
          borderColor: theme.backgroundColor as any,
        },
        props.style,
      ]}
    >
      <View style={styles.content}>
        {!!leftIcon && (
          <AnimatedView
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
              name={leftIcon}
              style={styles.icon}
            />
          </AnimatedView>
        )}

        <View style={styles.mainContentContainer}>
          {!!title && (
            <AnimatedText
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
            </AnimatedText>
          )}

          {!!subtitle && (
            <AnimatedText
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
            </AnimatedText>
          )}
        </View>

        {!!(rightIcon || loading) && (
          <View style={[styles.iconWrapper, { paddingRight: contentPadding }]}>
            {loading ? (
              <AnimatedActivityIndicator color={theme.foregroundColor as any} />
            ) : (
              !!rightIcon && (
                <AnimatedIcon
                  color={theme.foregroundColor}
                  name={rightIcon}
                  style={styles.icon}
                />
              )
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
