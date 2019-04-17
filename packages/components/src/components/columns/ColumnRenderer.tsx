import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'

import {
  Column as ColumnType,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  GitHubIcon,
  isEventPrivate,
  isItemRead,
  isNotificationPrivate,
  ThemeColors,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderHeight,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import {
  activityColumnHasAnyFilter,
  notificationColumnHasAnyFilter,
} from '../../utils/helpers/filters'
import { FreeTrialHeaderMessage } from '../common/FreeTrialHeaderMessage'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'

export function getColumnCardThemeColors(
  _backgroundColor: string,
): {
  column: keyof ThemeColors
  unread: keyof ThemeColors
  unread__hover: keyof ThemeColors
  read: keyof ThemeColors
  read__hover: keyof ThemeColors
} {
  // const luminance = getLuminance(backgroundColor)

  // if (luminance <= 0.02) {
  //   return {
  //     column: 'backgroundColor',
  //     unread: 'backgroundColorLighther2',
  //     unread__hover: 'backgroundColorLighther4',
  //     read: 'backgroundColor',
  //     read__hover: 'backgroundColorLess3',
  //   }
  // }

  return {
    column: 'backgroundColor',
    unread: 'backgroundColorLighther2',
    unread__hover: 'backgroundColorLighther3',
    read: 'backgroundColorDarker1',
    read__hover: 'backgroundColorDarker2',
  }
}

export interface ColumnRendererProps {
  avatarRepo?: string
  avatarUsername?: string
  children: React.ReactNode
  column: ColumnType
  columnIndex: number
  disableColumnOptions?: boolean
  icon: GitHubIcon
  owner: string | undefined
  pagingEnabled?: boolean
  repo: string | undefined
  repoIsKnown: boolean
  subtitle: string | undefined
  title: string
}

export const ColumnRenderer = React.memo((props: ColumnRendererProps) => {
  const {
    avatarRepo,
    avatarUsername,
    children,
    column,
    columnIndex,
    disableColumnOptions,
    icon,
    owner,
    pagingEnabled,
    repo,
    repoIsKnown,
    subtitle,
    title,
  } = props

  const [_isLocalFiltersOpened, setIsLocalFiltersOpened] = useState(false)
  const {
    enableSharedFiltersView,
    inlineMode,
    isSharedFiltersOpened: _isSharedFiltersOpened,
  } = useColumnFilters()
  const isFiltersOpened = enableSharedFiltersView
    ? _isSharedFiltersOpened
    : _isLocalFiltersOpened

  const { appOrientation } = useAppLayout()
  const { appViewMode, cardViewMode } = useAppViewMode()

  const filteredSubscriptionsDataSelectorRef = useRef(
    selectors.createFilteredSubscriptionsDataSelector(cardViewMode),
  )

  const columnRef = useRef<View>(null)
  useTheme(theme => {
    if (!columnRef.current) return

    columnRef.current!.setNativeProps({
      style: {
        backgroundColor:
          theme[getColumnCardThemeColors(theme.backgroundColor).column],
      },
    })
  })

  useEffect(() => {
    filteredSubscriptionsDataSelectorRef.current = selectors.createFilteredSubscriptionsDataSelector(
      cardViewMode,
    )
  }, [cardViewMode, ...column.subscriptionIds])

  useEmitter(
    'TOGGLE_COLUMN_FILTERS',
    payload => {
      if (payload.columnId !== column.id) return
      if (enableSharedFiltersView) return
      setIsLocalFiltersOpened(v => !v)
    },
    [column.id, enableSharedFiltersView],
  )

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
    (
      item:
        | EnhancedGitHubEvent
        | EnhancedGitHubNotification
        | EnhancedGitHubIssueOrPullRequest,
    ) => {
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
      : false) // TODO: Handle for IssueOrPullRequest Column

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

  function focusColumn() {
    emitter.emit('FOCUS_ON_COLUMN', {
      columnId: column.id,
      columnIndex,
      highlight: false,
      scrollTo: false,
    })
  }

  function toggleColumnFilters() {
    emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId: column.id })
  }

  const toggleOptions = () => {
    focusColumn()
    toggleColumnFilters()
  }

  const hasOneUnreadItem = (filteredItems as any[]).some(
    (
      item:
        | EnhancedGitHubNotification
        | EnhancedGitHubEvent
        | EnhancedGitHubIssueOrPullRequest,
    ) => !isItemRead(item),
  )

  const defaultContainerHeight =
    appOrientation === 'portrait'
      ? Dimensions.get('window').height - columnHeaderHeight - sidebarSize - 2
      : Dimensions.get('window').height - columnHeaderHeight - 1

  return (
    <Column
      key={`column-renderer-${column.id}-inner-container`}
      ref={columnRef}
      columnId={column.id}
      fullWidth={appViewMode === 'single-column'}
      pagingEnabled={pagingEnabled}
      renderSideSeparators
    >
      <ColumnHeader key={`column-renderer-${column.id}-header`}>
        <ColumnHeaderItem
          analyticsLabel={undefined}
          avatarProps={
            avatarRepo || avatarUsername
              ? { repo: avatarRepo, username: avatarUsername }
              : undefined
          }
          fixedIconSize
          iconName={icon}
          style={[sharedStyles.flex, { alignItems: 'flex-start' }]}
          subtitle={`${subtitle || ''}`.toLowerCase()}
          title={`${title || ''}`.toLowerCase()}
          tooltip={undefined}
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
          tooltip="Clear column"
        />

        <ColumnHeaderItem
          key="column-options-button-toggle-mark-as-read"
          analyticsLabel={!hasOneUnreadItem ? 'mark_as_unread' : 'mark_as_read'}
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
          tooltip={
            !hasOneUnreadItem ? 'Mark all as unread' : 'Mark all as read'
          }
        />

        {!disableColumnOptions && (
          <ColumnHeaderItem
            key="column-options-button-toggle-column-options"
            analyticsAction={isFiltersOpened ? 'hide' : 'show'}
            analyticsLabel="column_options"
            enableForegroundHover
            fixedIconSize
            iconName="settings"
            onPress={toggleOptions}
            style={{
              paddingHorizontal: contentPadding / 3,
            }}
            tooltip="Filters"
          />
        )}
      </ColumnHeader>

      <ViewMeasurer
        key="column-renderer-view-measurer"
        defaultMeasures={{ width: 0, height: defaultContainerHeight }}
        properties="height"
        style={sharedStyles.flex}
      >
        {({ height: containerHeight }) => (
          <>
            {!disableColumnOptions && !enableSharedFiltersView && (
              <ColumnOptionsRenderer
                key="column-options-renderer"
                close={toggleOptions}
                columnId={column.id}
                containerHeight={containerHeight}
                // fixedPosition="right"
                // fixedWidth={250}
                // forceOpenAll
                isOpen={isFiltersOpened}
              />
            )}

            <View
              style={[
                sharedStyles.flex,
                (containerHeight < 500 ||
                  Platform.realOS === 'ios' ||
                  Platform.realOS === 'android') && {
                  flexDirection: 'column-reverse',
                },
              ]}
              pointerEvents={
                isFiltersOpened && !inlineMode ? 'none' : undefined
              }
            >
              {!!isFreeTrial && <FreeTrialHeaderMessage />}
              {children}
            </View>
          </>
        )}
      </ViewMeasurer>
    </Column>
  )
})
