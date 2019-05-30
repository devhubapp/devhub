import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { contentPadding } from '../../styles/variables'
import { Button, ButtonProps } from '../common/Button'
import { ThemedActivityIndicator } from '../themed/ThemedActivityIndicator'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export interface GitHubLoginButtonProps
  extends Omit<ButtonProps, 'children' | 'onPress'> {
  horizontal?: boolean
  leftIcon?: GitHubIcon
  loading?: boolean
  onPress: () => void
  rightIcon?: GitHubIcon
  subtitle?: string
  subtitleProps?: TextProps
  textProps?: TextProps
  title?: string
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    overflow: 'hidden',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    overflow: 'hidden',
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
    flex: 1,
    alignItems: 'flex-start',
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

  return (
    <Button
      size={58}
      {...otherProps}
      style={styles.button}
      contentContainerStyle={styles.contentContainer}
    >
      <>
        {!!leftIcon && (
          <ThemedView
            borderColor="foregroundColor"
            style={[styles.iconWrapper, { paddingLeft: contentPadding }]}
          >
            <ThemedIcon
              name={leftIcon}
              style={styles.icon}
              color="foregroundColor"
            />
          </ThemedView>
        )}

        <View style={styles.mainContentContainer}>
          {!!title && (
            <ThemedText
              color="foregroundColor"
              {...textProps}
              style={[styles.title, textProps.style]}
            >
              {title}
            </ThemedText>
          )}

          {!!subtitle && (
            <ThemedText
              color="foregroundColorMuted60"
              {...subtitleProps}
              style={[styles.subtitleText, subtitleProps.style]}
            >
              {subtitle}
            </ThemedText>
          )}
        </View>

        {!!(rightIcon || loading) && (
          <View style={[styles.iconWrapper, { paddingRight: contentPadding }]}>
            {loading ? (
              <ThemedActivityIndicator color="foregroundColor" />
            ) : (
              !!rightIcon && (
                <ThemedIcon
                  color="foregroundColor"
                  name={rightIcon}
                  style={styles.icon}
                />
              )
            )}
          </View>
        )}
      </>
    </Button>
  )
}
