import React, { SFC } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native'

import { Octicons as Icon } from '../../libs/vector-icons'
import { contentPadding } from '../../styles/variables'
import { ThemeConsumer } from '../context/ThemeContext'

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
  } as ViewStyle,

  content: {
    flex: 1,
    flexDirection: 'row',
  } as ViewStyle,

  iconWrapper: {
    alignItems: 'center',
    borderWidth: 0,
    justifyContent: 'center',
  } as ViewStyle,

  icon: {
    fontSize: 20,
  } as TextStyle,

  mainContentContainer: {
    alignItems: 'flex-start',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: contentPadding,
  } as ViewStyle,

  title: {
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'left',
  } as TextStyle,

  subtitleText: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'left',
  } as TextStyle,
})

const GitHubLoginButton: SFC<GitHubLoginButtonProps> = ({
  leftIcon,
  loading,
  rightIcon,
  subtitle,
  subtitleProps = {},
  textProps = {},
  title,
  ...props
}) => (
  <ThemeConsumer>
    {({ theme }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        {...props}
        style={[
          styles.button,
          {
            backgroundColor: theme.invert().backgroundColor,
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
                name={leftIcon!}
                style={[
                  styles.icon,
                  {
                    color: theme.invert().foregroundColor,
                  },
                ]}
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
                    color: theme.invert().foregroundColor,
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
                    color: theme.invert().foregroundColorMuted50,
                  },
                  subtitleProps.style,
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>

          {Boolean(rightIcon || loading) && (
            <View
              style={[styles.iconWrapper, { paddingRight: contentPadding }]}
            >
              {loading ? (
                <ActivityIndicator color={theme.invert().foregroundColor} />
              ) : (
                <Icon name={rightIcon!} style={styles.icon} />
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    )}
  </ThemeConsumer>
)

GitHubLoginButton.defaultProps = {
  leftIcon: 'mark-github',
  loading: false,
  rightIcon: '',
  subtitle: '',
  subtitleProps: undefined,
  textProps: undefined,
  title: '',
}

export default GitHubLoginButton
