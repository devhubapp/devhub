import React from 'react'
import { StyleSheet, TextProps, View } from 'react-native'

import { IconProp } from '../../libs/vector-icons'
import { sharedStyles } from '../../styles/shared'
import {
  contentPadding,
  normalTextSize,
  scaleFactor,
  smallerTextSize,
} from '../../styles/variables'
import { Button, ButtonProps } from '../common/Button'
import { useAppLayout } from '../context/LayoutContext'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { Spacer } from './Spacer'

export interface GitHubLoginButtonProps
  extends Omit<ButtonProps, 'children' | 'colors' | 'onPress' | 'textStyle'> {
  horizontal?: boolean
  leftIcon?: IconProp
  loading?: boolean
  onPress: () => void
  rightIcon?: IconProp
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
    justifyContent: 'flex-start',
    minWidth: 250,
    paddingHorizontal: contentPadding * 2,
    overflow: 'hidden',
  },

  titleText: {
    width: '100%',
    fontWeight: '600',
    fontSize: normalTextSize + 1 * scaleFactor,
    lineHeight: normalTextSize + 6 * scaleFactor,
  },

  subtitleText: {
    width: '100%',
    fontWeight: '400',
    fontSize: smallerTextSize,
    lineHeight: smallerTextSize + 4 * scaleFactor,
  },
})

export function GitHubLoginButton(props: GitHubLoginButtonProps) {
  const {
    leftIcon,
    rightIcon,
    subtitle = '',
    textProps = {},
    title = '',
    ...otherProps
  } = props

  const { sizename } = useAppLayout()

  return (
    <Button
      {...({ type: 'primary' } as any)}
      {...otherProps}
      contentContainerStyle={styles.contentContainer}
      size={50 * scaleFactor}
      style={[styles.button, sizename === '1-small' && { width: '100%' }]}
    >
      {({ foregroundThemeColor }) => (
        <>
          {!!(leftIcon && leftIcon.name) && (
            <>
              <ThemedIcon
                {...leftIcon}
                color={foregroundThemeColor}
                size={20 * scaleFactor}
              />

              <Spacer width={contentPadding / 2} />
            </>
          )}

          <View
            style={[sharedStyles.flexGrow, sharedStyles.alignItemsFlexStart]}
          >
            {!!title && (
              <ThemedText
                color={foregroundThemeColor}
                {...textProps}
                style={[styles.titleText, textProps.style]}
              >
                {title}
              </ThemedText>
            )}

            {!!subtitle && (
              <ThemedText
                color={foregroundThemeColor}
                {...textProps}
                style={[styles.subtitleText, textProps.style]}
              >
                {subtitle}
              </ThemedText>
            )}
          </View>

          {!!(rightIcon && rightIcon.name) && (
            <>
              <Spacer width={contentPadding / 2} />

              <ThemedIcon
                {...rightIcon}
                color={foregroundThemeColor}
                size={20 * scaleFactor}
              />
            </>
          )}
        </>
      )}
    </Button>
  )
}
