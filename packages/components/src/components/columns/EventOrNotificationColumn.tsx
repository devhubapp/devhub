import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Alert, View } from 'react-native'

import {
  Column as ColumnType,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubNotification,
  getColumnHeaderDetails,
  isItemRead,
} from '@devhub/core'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import {
  activityColumnHasAnyFilter,
  notificationColumnHasAnyFilter,
} from '../../utils/helpers/filters'
import { AccordionView } from '../common/AccordionView'
import { Spacer } from '../common/Spacer'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'

export interface EventOrNotificationColumnProps {
  children: React.ReactNode
  column: ColumnType
  columnIndex: number
  onColumnOptionsVisibilityChange?: (isOpen: boolean) => void
  owner: string | undefined
  pagingEnabled?: boolean
  repo: string | undefined
  repoIsKnown: boolean
  subscriptions: Array<ColumnSubscription | undefined>
}

export const EventOrNotificationColumn = React.memo(
  (props: EventOrNotificationColumnProps) => {
    const {
      children,
      column,
      columnIndex,
      onColumnOptionsVisibilityChange,
      owner,
      pagingEnabled,
      repo,
      repoIsKnown,
      subscriptions,
    } = props

    const accordionRef = useRef<AccordionView>(null)

    const [
      columnOptionsContainerHeight,
      setColumnOptionsContainerHeight,
    ] = useState(0)

    const [showColumnOptions, setShowColumnOptions] = useState(false)

    const filteredSubscriptionsDataSelectorRef = useRef(
      selectors.createFilteredSubscriptionsDataSelector(),
    )

    useEffect(() => {
      filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector()
    }, column.subscriptionIds)

    const filteredItems = useReduxState(
      useCallback(
        state => {
          return filteredSubscriptionsDataSelectorRef.current(
            state,
            column.subscriptionIds,
            column.filters,
          )
        },
        [column.subscriptionIds, column.filters],
      ),
    )

    const hasPrivateAccess = useReduxState(
      selectors.githubHasPrivateAccessSelector,
    )

    const clearableItems = (filteredItems as any[]).filter(
      (item: EnhancedGitHubEvent | EnhancedGitHubNotification) => {
        return !!(item && !item.saved) /* && isItemRead(item) */
      },
    )

    const setColumnClearedAtFilter = useReduxAction(
      actions.setColumnClearedAtFilter,
    )

    const markItemsAsReadOrUnread = useReduxAction(
      actions.markItemsAsReadOrUnread,
    )

    const markAllNotificationsAsReadOrUnread = useReduxAction(
      actions.markAllNotificationsAsReadOrUnread,
    )

    const markRepoNotificationsAsReadOrUnread = useReduxAction(
      actions.markRepoNotificationsAsReadOrUnread,
    )

    useEffect(
      () => {
        if (onColumnOptionsVisibilityChange)
          onColumnOptionsVisibilityChange(showColumnOptions)
      },
      [onColumnOptionsVisibilityChange, showColumnOptions],
    )

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    const toggleOptions = () => {
      // this is more complex than usual
      // because im doing some weird workarounds
      // to fix the animation between nested accordions.
      // when this one opens, I "lock" it,
      // so the nested ones doesnt trigger an animation on this one.

      if (!accordionRef.current) return

      if (showColumnOptions) {
        if (accordionRef.current.isLocked()) {
          accordionRef.current.setOnFinishListener(() => {
            if (accordionRef.current) {
              accordionRef.current.setOnFinishListener(null)
            }

            setShowColumnOptions(false)
          })

          accordionRef.current.unlock()
        } else {
          accordionRef.current.setOnFinishListener(null)
          accordionRef.current.unlock()
          setShowColumnOptions(false)
        }
      } else {
        accordionRef.current.setOnFinishListener(() => {
          if (accordionRef.current) {
            accordionRef.current.setOnFinishListener(null)
            accordionRef.current.lock()
          }
        })

        setShowColumnOptions(true)
      }
    }

    const hasOneUnreadItem = (filteredItems as any[]).some(
      (item: EnhancedGitHubNotification | EnhancedGitHubEvent) =>
        !isItemRead(item),
    )

    return (
      <Column columnId={column.id} pagingEnabled={pagingEnabled}>
        <ColumnHeader>
          <ColumnHeaderItem
            analyticsLabel={undefined}
            avatarProps={requestTypeIconAndData.avatarProps}
            fixedIconSize
            iconName={requestTypeIconAndData.icon}
            subtitle={`${requestTypeIconAndData.subtitle || ''}`.toLowerCase()}
            title={`${requestTypeIconAndData.title || ''}`.toLowerCase()}
            style={{ flex: 1, alignItems: 'flex-start' }}
          />

          <Spacer width={contentPadding / 2} />

          <ColumnHeaderItem
            analyticsLabel={
              !hasOneUnreadItem ? 'mark_as_unread' : 'mark_as_read'
            }
            disabled={!filteredItems.length}
            enableForegroundHover
            fixedIconSize
            iconName={!hasOneUnreadItem ? 'mail-read' : 'mail'}
            onPress={() => {
              const unread = !hasOneUnreadItem

              const visibleItemIds = (filteredItems as any[]).map(
                (item: EnhancedGitHubNotification | EnhancedGitHubEvent) =>
                  item && item.id,
              )

              const hasAnyFilter =
                column.type === 'notifications'
                  ? notificationColumnHasAnyFilter(
                      { ...column.filters, clearedAt: undefined },
                      hasPrivateAccess,
                    )
                  : column.type === 'activity'
                  ? activityColumnHasAnyFilter(
                      { ...column.filters, clearedAt: undefined },
                      hasPrivateAccess,
                    )
                  : false

              // column doesnt have any filter,
              // so lets mark ALL notifications on github as read at once,
              // instead of marking only the visible items one by one
              if (column.type === 'notifications' && !hasAnyFilter && !unread) {
                if (repoIsKnown) {
                  if (owner && repo) {
                    markRepoNotificationsAsReadOrUnread({
                      owner,
                      repo,
                      unread,
                    })

                    return
                  }
                } else {
                  markAllNotificationsAsReadOrUnread({ unread })
                  return
                }
              }

              // mark only the visible items as read/unread one by one
              markItemsAsReadOrUnread({
                type: column.type,
                itemIds: visibleItemIds,
                unread,
              })
            }}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />

          <ColumnHeaderItem
            analyticsLabel="clear_column"
            disabled={!clearableItems.length}
            enableForegroundHover
            fixedIconSize
            iconName="check"
            onPress={() =>
              setColumnClearedAtFilter({
                columnId: column.id,
                clearedAt: new Date().toISOString(),
              })
            }
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />

          <ColumnHeaderItem
            analyticsAction={showColumnOptions ? 'hide' : 'show'}
            analyticsLabel="column_options"
            enableForegroundHover
            fixedIconSize
            iconName="settings"
            onPress={toggleOptions}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />
        </ColumnHeader>

        <View
          style={{ flex: 1 }}
          onLayout={e => {
            setColumnOptionsContainerHeight(e.nativeEvent.layout.height)
          }}
        >
          <ColumnOptionsRenderer
            accordionRef={accordionRef}
            close={toggleOptions}
            column={column}
            columnIndex={columnIndex}
            containerHeight={columnOptionsContainerHeight}
            visible={!!showColumnOptions}
          />

          {children}
        </View>
      </Column>
    )
  },
)
