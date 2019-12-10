import {
  cheapestPlanWithNotifications,
  constants,
  formatPriceAndInterval,
  getColumnOption,
  ThemeColors,
} from '@devhub/core'
import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useDispatch } from 'react-redux'

import { useColumn } from '../../hooks/use-column'
import { useDesktopOptions } from '../../hooks/use-desktop-options'
import { useReduxState } from '../../hooks/use-redux-state'
import { Browser } from '../../libs/browser'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import { useSafeArea } from '../../libs/safe-area-view'
import { OcticonIconProps } from '../../libs/vector-icons'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding, smallerTextSize } from '../../styles/variables'
import { Avatar } from '../common/Avatar'
import { IconButton, IconButtonProps } from '../common/IconButton'
import { Link } from '../common/Link'
import { ScrollViewWithOverlay } from '../common/ScrollViewWithOverlay'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { TouchableWithoutFeedback } from '../common/TouchableWithoutFeedback'
import { useDialog } from '../context/DialogContext'
import { ThemedIcon } from '../themed/ThemedIcon'
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
  icon?: OcticonIconProps['name']
  left?: ReactNode
  right?: ReactNode
  style?: StyleProp<ViewStyle>
  subtitle?: string
  title: string
}

export const columnHeaderItemContentSize = 17
const columnHeaderTitleSize = columnHeaderItemContentSize - 1
const columnHeaderTitleLineHeight = columnHeaderTitleSize + 4
const columnHeaderSubtitleSize = columnHeaderItemContentSize - 5
const columnHeaderSubtitleLineHeight = columnHeaderSubtitleSize + 4

export const columnHeaderHeight =
  contentPadding + columnHeaderTitleLineHeight + columnHeaderSubtitleLineHeight

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

  const Dialog = useDialog()

  const safeAreaInsets = useSafeArea()
  const dispatch = useDispatch()
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

          <ScrollViewWithOverlay
            alwaysBounceHorizontal={false}
            containerStyle={styles.mainContainer}
            contentContainerStyle={styles.mainContentContainer}
            horizontal
          >
            {avatar && avatar.imageURL ? (
              <>
                <Avatar
                  avatarUrl={avatar.imageURL}
                  linkURL={avatar.linkURL}
                  shape="circle"
                  size={columnHeaderItemContentSize * 1.1}
                />
                <Spacer width={(contentPadding * 2) / 3} />
              </>
            ) : icon ? (
              <>
                <ThemedIcon
                  color="foregroundColor"
                  family="octicon"
                  name={icon}
                  size={columnHeaderItemContentSize * 1.1}
                />
                <Spacer width={(contentPadding * 2) / 3} />
              </>
            ) : null}

            <View>
              {!!title && (
                <>
                  <ThemedText
                    color="foregroundColor"
                    numberOfLines={1}
                    style={styles.title}
                  >
                    {title}
                  </ThemedText>

                  <Spacer width={contentPadding / 2} />
                </>
              )}

              {!!subtitle && (
                <>
                  <View style={sharedStyles.horizontal}>
                    <ThemedText
                      color="foregroundColorMuted65"
                      numberOfLines={1}
                      style={styles.subtitle}
                    >
                      {subtitle}
                    </ThemedText>

                    <Spacer width={contentPadding / 2} />

                    {Platform.OS === 'web' &&
                      (!enableDesktopPushNotificationsOption.platformSupports ||
                        !enableDesktopPushNotificationsOption.hasAccess ||
                        enableDesktopPushNotificationsOption.value) &&
                      (() => {
                        const tooltip =
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
                                    'Download the Desktop app at devhubapp.com to have access to it.' +
                                    (enableDesktopPushNotificationsOption.hasAccess ===
                                    'trial'
                                      ? ' \n\nPS: You are currently on a free trial, enjoy it!'
                                      : '')
                              }`
                            : !enableDesktopPushNotificationsOption.platformSupports
                            ? 'Push Notifications are not supported on this platform.' +
                              ' Download the Desktop app at devhubapp.com to have access to it.' +
                              (enableDesktopPushNotificationsOption.hasAccess ===
                              'trial'
                                ? ' \n\nPS: You are currently on a free trial, enjoy it!'
                                : '')
                            : !enableDesktopPushNotificationsOption.hasAccess &&
                              cheapestPlanWithNotifications &&
                              cheapestPlanWithNotifications.amount
                            ? `Unlock Push Notifications and other features for ${formatPriceAndInterval(
                                cheapestPlanWithNotifications,
                              )}`
                            : ''

                        const DownloadConfirmationHandler = () => {
                          Dialog.show('Download Desktop App?', tooltip, [
                            {
                              text: 'Download',
                              onPress: () => {
                                Browser.openURLOnNewTab(
                                  constants.DEVHUB_LINKS.DOWNLOAD_PAGE,
                                )
                              },
                              style: 'default',
                            },
                            {
                              text: 'Cancel',
                              onPress: () => undefined,
                              style: 'cancel',
                            },
                          ])
                        }

                        return (
                          <Link
                            analyticsLabel="column_header_push_notifications_cta"
                            hitSlop={{
                              top: contentPadding,
                              bottom: contentPadding,
                              left: contentPadding,
                              right: contentPadding,
                            }}
                            onPress={
                              enableDesktopPushNotificationsOption.platformSupports
                                ? // platform supports

                                  enableDesktopPushNotificationsOption.hasAccess
                                  ? // plan supports

                                    enableDesktopPushNotificationsOption.value
                                    ? // is enabled
                                      undefined
                                    : // not enabled
                                      DownloadConfirmationHandler
                                  : // plan doesnt support
                                    () => {
                                      dispatch(
                                        actions.pushModal({
                                          name: 'PRICING',
                                          params: {
                                            highlightFeature:
                                              'enablePushNotifications',
                                            // initialSelectedPlanId:
                                            //   cheapestPlanWithNotifications.id,
                                          },
                                        }),
                                      )
                                    }
                                : // platform doesnt support
                                  DownloadConfirmationHandler
                            }
                            style={sharedStyles.relative}
                          >
                            <ThemedIcon
                              color="foregroundColorMuted40"
                              name="bell"
                              size={smallerTextSize}
                              {...Platform.select({ web: { title: tooltip } })}
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
                        )
                      })()}
                  </View>

                  <Spacer width={contentPadding / 2} />
                </>
              )}
            </View>
          </ScrollViewWithOverlay>

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
    maxWidth: '100%',
    height: 'auto',
    overflow: 'hidden',
  },

  innerContainer: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignContent: 'center',
    alignItems: 'center',
    maxWidth: '100%',
    height: columnHeaderHeight,
    overflow: 'hidden',
  },

  mainContainer: {
    flex: 1,
    maxWidth: '100%',
    height: columnHeaderTitleLineHeight + columnHeaderSubtitleLineHeight,
    overflow: 'hidden',
  },

  mainContentContainer: {
    alignContent: 'center',
    alignItems: 'center',
  },

  title: {
    lineHeight: columnHeaderTitleLineHeight,
    fontSize: columnHeaderTitleSize,
    fontWeight: '800',
  },

  subtitle: {
    lineHeight: columnHeaderSubtitleLineHeight,
    fontSize: columnHeaderSubtitleSize,
  },
})
