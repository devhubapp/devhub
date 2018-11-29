import React from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native'

import { Octicons as Icon } from '../../libs/vector-icons'
import { contentPadding } from '../../styles/variables'
import { useTheme } from '../context/ThemeContext'

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

  const theme = useTheme()

  return (
    <TouchableOpacity
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
          <View
            style={[
              styles.iconWrapper,
              {
                borderColor: theme.foregroundColor,
                paddingLeft: contentPadding,
              },
            ]}
          >
            <Icon
              color={theme.foregroundColor}
              name={leftIcon!}
              style={styles.icon}
            />
          </View>
        )}

        <View style={styles.mainContentContainer}>
          {Boolean(title) && (
            <Text
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
            </Text>
          )}

          {Boolean(subtitle) && (
            <Text
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
            </Text>
          )}
        </View>

        {Boolean(rightIcon || loading) && (
          <View style={[styles.iconWrapper, { paddingRight: contentPadding }]}>
            {loading ? (
              <ActivityIndicator color={theme.foregroundColor} />
            ) : (
              <Icon
                color={theme.foregroundColor}
                name={rightIcon!}
                style={styles.icon}
              />
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
