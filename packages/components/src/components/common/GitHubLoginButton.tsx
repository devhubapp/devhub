import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { contentPadding } from '../../styles/variables'
import { Button, ButtonProps } from '../common/Button'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { Spacer } from './Spacer'

export interface GitHubLoginButtonProps
  extends Omit<ButtonProps, 'children' | 'colors' | 'onPress'> {
  horizontal?: boolean
  leftIcon?: GitHubIcon
  loading?: boolean
  onPress: () => void
  rightIcon?: GitHubIcon
  subtitle?: string
  textProps?: TextProps
  title?: string
}

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },

  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    minWidth: 250,
    paddingHorizontal: contentPadding * 2,
    overflow: 'hidden',
  },

  iconWrapper: {
    alignItems: 'center',
    borderWidth: 0,
    justifyContent: 'center',
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
    textAlign: 'center',
  },

  subtitleText: {
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'center',
  },
})

export function GitHubLoginButton(props: GitHubLoginButtonProps) {
  const {
    leftIcon = 'mark-github',
    rightIcon = '',
    subtitle = '',
    textProps = {},
    title = '',
    ...otherProps
  } = props

  const { sizename } = useAppLayout()

  return (
    <Button
      {...otherProps}
      contentContainerStyle={styles.contentContainer}
      size={50}
      style={[styles.button, sizename === '1-small' && { width: '100%' }]}
      type="primary"
    >
      {({ foregroundThemeColor }) => (
        <>
          {!!leftIcon && (
            <>
              <ThemedIcon
                color={foregroundThemeColor}
                name={leftIcon}
                size={20}
              />

              <Spacer width={contentPadding / 2} />
            </>
          )}

          <View>
            {!!title && (
              <ThemedText
                color={foregroundThemeColor}
                {...textProps}
                style={[styles.title, textProps.style]}
              >
                {title}
              </ThemedText>
            )}
          </View>

          {!!rightIcon && (
            <View
              style={[styles.iconWrapper, { paddingRight: contentPadding }]}
            >
              {!!rightIcon && (
                <>
                  <Spacer width={contentPadding / 2} />

                  <ThemedIcon
                    color={foregroundThemeColor}
                    name={rightIcon}
                    size={20}
                  />
                </>
              )}
            </View>
          )}
        </>
      )}
    </Button>
  )
}
