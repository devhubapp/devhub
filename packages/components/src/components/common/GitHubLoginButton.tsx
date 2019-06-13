import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { GitHubIcon } from '@devhub/core'
import { contentPadding } from '../../styles/variables'
import { SpringAnimatedIcon } from '../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../animated/spring/SpringAnimatedText'
import { Button, ButtonProps } from '../common/Button'
import { useAppLayout } from '../context/LayoutContext'
import { Spacer } from './Spacer'

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
    subtitleProps = {},
    textProps = {},
    title = '',
    ...otherProps
  } = props

  const { sizename } = useAppLayout()

  return (
    <Button
      {...otherProps}
      backgroundThemeColor="primaryBackgroundColor"
      size={50}
      style={[styles.button, sizename === '1-small' && { width: '100%' }]}
      contentContainerStyle={styles.contentContainer}
    >
      {({ springAnimatedStyles }) => (
        <>
          {!!leftIcon && (
            <>
              <SpringAnimatedIcon
                name={leftIcon}
                size={20}
                style={{ color: springAnimatedStyles.textColor }}
              />

              <Spacer width={contentPadding / 2} />
            </>
          )}

          <View>
            {!!title && (
              <SpringAnimatedText
                {...textProps}
                style={[
                  styles.title,
                  textProps.style,
                  { color: springAnimatedStyles.textColor },
                ]}
              >
                {title}
              </SpringAnimatedText>
            )}
          </View>

          {!!rightIcon && (
            <View
              style={[styles.iconWrapper, { paddingRight: contentPadding }]}
            >
              {!!rightIcon && (
                <>
                  <Spacer width={contentPadding / 2} />

                  <SpringAnimatedIcon
                    name={rightIcon}
                    size={20}
                    style={{ color: springAnimatedStyles.textColor }}
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
