import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import {
  activePlans,
  constants,
  formatPrice,
  getColumnOption,
  ThemeColors,
} from '@devhub/core'
import { useColumn } from '../../hooks/use-column'
import { useDesktopOptions } from '../../hooks/use-desktop-options'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import { useSafeArea } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallerTextSize } from '../../styles/variables'
import { Avatar } from '../common/Avatar'
import { IconButton, IconButtonProps } from '../common/IconButton'
import { Link } from '../common/Link'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { TouchableWithoutFeedback } from '../common/TouchableWithoutFeedback'
import { ThemedIcon, ThemedIconProps } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'

export function getColumnHeaderThemeColors(): {
  normal: keyof ThemeColors
  hover: keyof ThemeColors
  selected: keyof ThemeColors
} {
  return {
    normal: 'backgroundColor',
    hover: 'backgroundColorLess1',
    selected: 'backgroundColorLess1',
  }
}

export interface ColumnHeaderProps {
  avatar?: { imageURL: string; linkURL: string }
  columnId?: string
  icon?: ThemedIconProps['name']
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  subtitle?: string
  title: string
}

export const columnHeaderItemContentSize = 17
export const columnHeaderHeight =
  contentPadding * 2 + columnHeaderItemContentSize

export function ColumnHeader(props: ColumnHeaderProps) {
  const {
    avatar,
    columnId,
    icon,
    left,
    right,
    style,
    subtitle: _subtitle,
    title: _title,
  } = props

  const title = `${_title || ''}`.toLowerCase()
  const subtitle = `${_subtitle || ''}`.toLowerCase()

  const safeAreaInsets = useSafeArea()
  const bannerMessage = useReduxState(selectors.bannerMessageSelector)
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const { column } = useColumn(columnId || '')
  const {
    enablePushNotifications: enableDesktopPushNotifications,
  } = useDesktopOptions()

  const enableDesktopPushNotificationsOption = getColumnOption(
    column,
    'enableDesktopPushNotifications',
    {
      Platform,
      plan,
    },
  )

  const cheapestPlanWithNotifications = activePlans
    .sort((a, b) => a.amount - b.amount)
    .find(p => p.featureFlags.enablePushNotifications)

  return (
    <ThemedView
      backgroundColor={getColumnHeaderThemeColors().normal}
      style={[
        styles.container,
        {
          paddingTop:
            bannerMessage && bannerMessage.message ? 0 : safeAreaInsets.top,
        },
      ]}
    >
      <TouchableWithoutFeedback
        onPress={
          columnId
            ? () => {
                emitter.emit('SCROLL_TOP_COLUMN', { columnId })
              }
            : undefined
        }
      >
        <View
          style={[
            styles.innerContainer,
            !left && { paddingLeft: (contentPadding * 2) / 3 },
            !right && { paddingRight: (contentPadding * 2) / 3 },
            style,
          ]}
        >
          {!!left && (
            <>
              {left}
              <Spacer width={contentPadding / 2} />
            </>
          )}

          <View style={styles.mainContentContainer}>
            {avatar && avatar.imageURL ? (
              <>
                <Avatar
                  avatarUrl={avatar.imageURL}
                  linkURL={avatar.linkURL}
                  shape="circle"
                  size={columnHeaderItemContentSize}
                />
                <Spacer width={contentPadding / 2} />
              </>
            ) : icon ? (
              <>
                <ThemedIcon
                  color="foregroundColor"
                  name={icon}
                  size={columnHeaderItemContentSize}
                />
                <Spacer width={contentPadding / 2} />
              </>
            ) : null}

            {!!title && (
              <>
                <ThemedText color="foregroundColor" style={styles.title}>
                  {title}
                </ThemedText>
                <Spacer width={contentPadding / 2} />
              </>
            )}

            {!!subtitle && (
              <>
                <ThemedText
                  color="foregroundColorMuted65"
                  style={styles.subtitle}
                >
                  {subtitle}
                </ThemedText>
                <Spacer width={contentPadding / 2} />

                {Platform.OS === 'web' &&
                  (!enableDesktopPushNotificationsOption.platformSupports ||
                    !enableDesktopPushNotificationsOption.hasAccess ||
                    enableDesktopPushNotificationsOption.value) && (
                    <>
                      <Link
                        analyticsLabel="column_header_push_notifications_cta"
                        hitSlop={{
                          top: contentPadding,
                          bottom: contentPadding,
                          left: contentPadding,
                          right: contentPadding,
                        }}
                        href={
                          !enableDesktopPushNotificationsOption.platformSupports
                            ? `${constants.LANDING_BASE_URL}/download`
                            : !enableDesktopPushNotificationsOption.hasAccess
                            ? `${constants.LANDING_BASE_URL}/pricing`
                            : ''
                        }
                        openOnNewTab
                        style={sharedStyles.relative}
                      >
                        <ThemedIcon
                          color="foregroundColorMuted40"
                          name="bell"
                          size={smallerTextSize}
                          {...Platform.select({
                            web: {
                              title:
                                enableDesktopPushNotificationsOption.hasAccess &&
                                enableDesktopPushNotificationsOption.value
                                  ? `${
                                      enableDesktopPushNotificationsOption.hasAccess ===
                                      'trial'
                                        ? '[TRIAL] '
                                        : ''
                                    }Push Notifications are enabled for this column${
                                      enableDesktopPushNotificationsOption.platformSupports
                                        ? Platform.isElectron &&
                                          !enableDesktopPushNotifications
                                          ? ', but disabled on this device.'
                                          : '.'
                                        : ', but not supported on this platform. ' +
                                            'Download the Desktop app to have access to it.' +
                                            enableDesktopPushNotificationsOption.hasAccess ===
                                          'trial'
                                        ? ' \n\nPS: You are currently on a free trial, enjoy it!'
                                        : ''
                                    }`
                                  : !enableDesktopPushNotificationsOption.platformSupports
                                  ? 'Push Notifications are not supported on this platform.' +
                                    ' Download the Desktop app to have access to it.' +
                                    (enableDesktopPushNotificationsOption.hasAccess ===
                                    'trial'
                                      ? ' \n\nPS: You are currently on a free trial, enjoy it!'
                                      : '')
                                  : !enableDesktopPushNotificationsOption.hasAccess &&
                                    cheapestPlanWithNotifications &&
                                    cheapestPlanWithNotifications.amount
                                  ? `Unlock Push Notifications and other features for ${formatPrice(
                                      cheapestPlanWithNotifications.amount,
                                      cheapestPlanWithNotifications.currency,
                                    )}/${
                                      cheapestPlanWithNotifications.interval
                                    }`
                                  : '',
                            },
                          })}
                        />

                        {!!(
                          !enableDesktopPushNotificationsOption.hasAccess ||
                          !enableDesktopPushNotificationsOption.platformSupports ||
                          (Platform.isElectron &&
                            !enableDesktopPushNotifications)
                        ) && (
                          <ThemedView
                            style={[
                              StyleSheet.absoluteFill,
                              sharedStyles.center,
                            ]}
                            pointerEvents="none"
                          >
                            <ThemedView
                              backgroundColor="lightRed"
                              style={{
                                width: 1,
                                height: smallerTextSize + 4,
                                transform: [{ rotateZ: '45deg' }],
                              }}
                              pointerEvents="none"
                            />
                          </ThemedView>
                        )}
                      </Link>

                      <Spacer width={contentPadding / 2} />
                    </>
                  )}
              </>
            )}
          </View>

          {right}
        </View>
      </TouchableWithoutFeedback>

      <Separator horizontal />
    </ThemedView>
  )
}

ColumnHeader.Button = IconButton

export type ColumnHeaderButtonProps = IconButtonProps

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: 'auto',
  },

  innerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    alignItems: 'center',
    height: columnHeaderHeight,
  },

  mainContentContainer: {
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    height: '100%',
  },

  title: {
    lineHeight: columnHeaderItemContentSize,
    fontSize: columnHeaderItemContentSize - 1,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: columnHeaderItemContentSize - 5,
  },
})
