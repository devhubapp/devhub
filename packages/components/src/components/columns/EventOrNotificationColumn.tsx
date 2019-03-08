import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'

import {
  Column as ColumnType,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubNotification,
  getColumnHeaderDetails,
  isEventPrivate,
  isItemRead,
  isNotificationPrivate,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import {
  activityColumnHasAnyFilter,
  notificationColumnHasAnyFilter,
} from '../../utils/helpers/filters'
import { FreeTrialHeaderMessage } from '../common/FreeTrialHeaderMessage'
import { Spacer } from '../common/Spacer'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'

export interface EventOrNotificationColumnProps {
  children: React.ReactNode
  column: ColumnType
  columnIndex: number
  disableColumnOptions?: boolean
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
      disableColumnOptions,
      onColumnOptionsVisibilityChange,
      owner,
      pagingEnabled,
      repo,
      repoIsKnown,
      subscriptions,
    } = props

    const [showColumnOptions, setShowColumnOptions] = useState(false)

    const filteredSubscriptionsDataSelectorRef = useRef(
      selectors.createFilteredSubscriptionsDataSelector(),
    )

    useEffect(() => {
      filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector()
    }, column.subscriptionIds)

    const { appViewMode } = useAppViewMode()

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

    const clearableItems = (filteredItems as any[]).filter(
      (item: EnhancedGitHubEvent | EnhancedGitHubNotification) => {
        return !!(item && !item.saved) /* && isItemRead(item) */
      },
    )

    const hasValidPaidPlan = false // TODO

    const isFreeTrial =
      !hasValidPaidPlan &&
      (column.type === 'activity'
        ? (filteredItems as any[]).some((item: EnhancedGitHubEvent) =>
            isEventPrivate(item),
          )
        : column.type === 'notifications'
        ? (filteredItems as any[]).some(
            (item: EnhancedGitHubNotification) =>
              isNotificationPrivate(item) && !!item.enhanced,
          )
        : false)

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

    useEffect(() => {
      if (onColumnOptionsVisibilityChange)
        onColumnOptionsVisibilityChange(showColumnOptions)
    }, [onColumnOptionsVisibilityChange, showColumnOptions])

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    function focusColumn() {
      emitter.emit('FOCUS_ON_COLUMN', {
        columnId: column.id,
        columnIndex,
        highlight: false,
        scrollTo: false,
      })
    }

    const toggleOptions = () => {
      setShowColumnOptions(v => !v)
      focusColumn()
    }

    const hasOneUnreadItem = (filteredItems as any[]).some(
      (item: EnhancedGitHubNotification | EnhancedGitHubEvent) =>
        !isItemRead(item),
    )

    return (
      <Column
        columnId={column.id}
        fullWidth={appViewMode === 'single-column'}
        pagingEnabled={pagingEnabled}
        renderSideSeparators
      >
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
            key="column-options-button-clear-column"
            analyticsLabel="clear_column"
            disabled={!clearableItems.length}
            enableForegroundHover
            fixedIconSize
            iconName="check"
            onPress={() => {
              setColumnClearedAtFilter({
                columnId: column.id,
                clearedAt: new Date().toISOString(),
              })

              focusColumn()
            }}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />

          <ColumnHeaderItem
            key="column-options-button-toggle-mark-as-read"
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
                  ? notificationColumnHasAnyFilter({
                      ...column.filters,
                      clearedAt: undefined,
                    })
                  : column.type === 'activity'
                  ? activityColumnHasAnyFilter({
                      ...column.filters,
                      clearedAt: undefined,
                    })
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

              focusColumn()
            }}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
          />

          {!disableColumnOptions && (
            <ColumnHeaderItem
              key="column-options-button-toggle-column-options"
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
          )}
        </ColumnHeader>

        <ViewMeasurer
          style={{
            flex: 1,
            flexDirection: 'column',
          }}
        >
          {({ height: containerHeight }) => (
            <>
              {!disableColumnOptions && (
                <ColumnOptionsRenderer
                  key="column-options-renderer"
                  close={toggleOptions}
                  columnId={column.id}
                  containerHeight={containerHeight}
                  visible={!!showColumnOptions}
                />
              )}

              <View style={{ flex: 1 }}>
                {!!isFreeTrial && <FreeTrialHeaderMessage />}

                {children}
              </View>
            </>
          )}
        </ViewMeasurer>
      </Column>
    )
  },
)
