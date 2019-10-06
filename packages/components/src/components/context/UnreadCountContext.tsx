import React, { useContext, useEffect, useRef } from 'react'

import {
  ColumnSubscription,
  getColumnHeaderDetails,
  getColumnOption,
  getFilteredItems,
  getItemsFromSubscriptions,
  ItemPushNotification,
} from '@devhub/core'
import { PixelRatio } from 'react-native'
import { useDesktopOptions } from '../../hooks/use-desktop-options'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as selectors from '../../redux/selectors'
import {
  CardPushNotification,
  getCardPushNotificationItem,
} from '../cards/BaseCard.shared'

export interface UnreadCountProviderProps {
  children?: React.ReactNode
}

export type UnreadCountProviderState = number

export const UnreadCountContext = React.createContext<UnreadCountProviderState>(
  0,
)
UnreadCountContext.displayName = 'UnreadCountContext'

export function UnreadCountProvider(props: UnreadCountProviderProps) {
  const notificationsLastShowedAtRef = useRef<string | null>(null) // TODO: persist this value
  const loggedUsername = useReduxState(selectors.currentGitHubUsernameSelector)!
  const _columns = useReduxState(selectors.columnsArrSelector)
  const subscriptions = useReduxState(selectors.userSubscriptionsArrSelector)
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const {
    enablePushNotifications: enableDesktopPushNotifications,
  } = useDesktopOptions()

  const columns = loggedUsername ? _columns : []

  const unreadIds = new Set<string>([])
  const pushNotifications = new Set<CardPushNotification>([])
  const pushNotificationsStringified = new Set<string>([])

  const enablePushNotificationOnThisDevice = !(
    Platform.isElectron && enableDesktopPushNotifications === false
  )

  useEffect(() => {
    notificationsLastShowedAtRef.current = new Date().toISOString()
  }, [plan && plan.id])

  columns.forEach(column => {
    if (!column) return

    const enableAppIconUnreadIndicatorOption = getColumnOption(
      column,
      'enableAppIconUnreadIndicator',
      {
        Platform,
        plan,
      },
    )
    const enableDesktopPushNotificationsOption = getColumnOption(
      column,
      'enableDesktopPushNotifications',
      {
        Platform,
        plan,
      },
    )

    const showAppIconUnreadIndicator =
      enableAppIconUnreadIndicatorOption.hasAccess &&
      enableAppIconUnreadIndicatorOption.platformSupports &&
      enableAppIconUnreadIndicatorOption.value
    const showDesktopPushNotifications =
      enablePushNotificationOnThisDevice &&
      enableDesktopPushNotificationsOption.hasAccess &&
      enableDesktopPushNotificationsOption.platformSupports &&
      enableDesktopPushNotificationsOption.value

    if (!(showAppIconUnreadIndicator || showDesktopPushNotifications)) return

    const columnSubscriptions = column.subscriptionIds
      .map(subscriptionId =>
        subscriptions.find(s => s && s.id && s.id === subscriptionId),
      )
      .filter(Boolean) as ColumnSubscription[]

    const columnItems = getItemsFromSubscriptions(columnSubscriptions)
    const unreadColumnItems =
      column.filters && column.filters.unread === false
        ? []
        : getFilteredItems(
            column.type,
            columnItems,
            { ...column.filters, unread: true },
            { loggedUsername, mergeSimilar: false, plan },
          )
    const columnHeader = getColumnHeaderDetails(
      column,
      columnSubscriptions,
      {
        baseURL: undefined,
        loggedUsername,
      },
      PixelRatio.getPixelSizeForLayoutSize,
    )

    unreadColumnItems.forEach(item => {
      if (!(item && item.id)) return

      if (showAppIconUnreadIndicator && !unreadIds.has(`${item.id}`)) {
        unreadIds.add(`${item.id}`)
      }

      const itemDate = // item.last_unread_at
        ('updated_at' in item && item.updated_at) ||
        ('created_at' in item && item.created_at)
      if (
        showDesktopPushNotifications &&
        itemDate &&
        (!notificationsLastShowedAtRef.current ||
          itemDate > notificationsLastShowedAtRef.current)
      ) {
        const pushNotification = getCardPushNotificationItem(column, item, {
          ownerIsKnown: !!(columnHeader && columnHeader.ownerIsKnown),
          plan,
          repoIsKnown: !!(columnHeader && columnHeader.repoIsKnown),
        })
        if (
          !pushNotificationsStringified.has(JSON.stringify(pushNotification))
        ) {
          pushNotifications.add(pushNotification)
          pushNotificationsStringified.add(JSON.stringify(pushNotification))
        }
      }
    })
  })

  useEffect(() => {
    if (!pushNotifications.size) return

    if (Platform.isElectron) {
      if (notificationsLastShowedAtRef.current) {
        Array.from(pushNotifications)
          .slice(0, 10)
          .reverse()
          .forEach(pushNotification => {
            window.ipc.send('show-notification', pushNotification)
          })
      } else {
        const pushNotification: ItemPushNotification = {
          title: 'DevHub',
          body: "You've got new notifications",
        }
        window.ipc.send('show-notification', pushNotification)
      }
    }

    pushNotifications.clear()
    pushNotificationsStringified.clear()

    notificationsLastShowedAtRef.current = new Date().toISOString()
  })

  return (
    <UnreadCountContext.Provider value={unreadIds.size}>
      {props.children}
    </UnreadCountContext.Provider>
  )
}

export const UnreadCountConsumer = UnreadCountContext.Consumer
;(UnreadCountConsumer as any).displayName = 'UnreadCountConsumer'

export function useUnreadCount() {
  return useContext(UnreadCountContext)
}
