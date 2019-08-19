import React, { useCallback, useRef, useState } from 'react'

import {
  Column as ColumnType,
  columnHasAnyFilter,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  getDefaultPaginationPerPage,
  GitHubIcon,
  isEventPrivate,
  isItemRead,
  isNotificationPrivate,
  ThemeColors,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumnData } from '../../hooks/use-column-data'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxAction } from '../../hooks/use-redux-action'
import { emitter } from '../../libs/emitter'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { FreeTrialHeaderMessage } from '../common/FreeTrialHeaderMessage'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useAppLayout } from '../context/LayoutContext'
import { Column } from './Column'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsAccordion } from './ColumnOptionsAccordion'

export function getColumnCardThemeColors(): {
  column: keyof ThemeColors
  card: keyof ThemeColors
  card__hover: keyof ThemeColors
  card__muted: keyof ThemeColors
  card__muted_hover: keyof ThemeColors
} {
  return {
    card: 'backgroundColorLighther1',
    card__hover: 'backgroundColorLess2',
    card__muted: 'backgroundColorDarker1',
    card__muted_hover: 'backgroundColorLess2',
    column: 'backgroundColor',
  }
}

export function getCardBackgroundThemeColor({
  isHovered,
  isMuted,
}: {
  isHovered?: boolean
  isMuted: boolean
}) {
  const backgroundThemeColors = getColumnCardThemeColors()

  const _backgroundThemeColor =
    (isMuted &&
      (isHovered
        ? backgroundThemeColors.card__muted_hover
        : backgroundThemeColors.card__muted)) ||
    (isHovered ? backgroundThemeColors.card__hover : backgroundThemeColors.card)

  return _backgroundThemeColor
}

export interface ColumnRendererProps {
  avatarRepo?: string
  avatarUsername?: string
  children: (p: {
    disableItemFocus: boolean
    isFiltersOpened: boolean
  }) => React.ReactNode
  column: ColumnType
  columnIndex: number
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
    icon,
    owner,
    pagingEnabled,
    repo,
    repoIsKnown,
    subtitle,
    title,
  } = props

  const columnOptionsRef = useRef<{ toggle: () => void }>(null)

  const [_isLocalFiltersOpened, setIsLocalFiltersOpened] = useState(false)

  const {
    enableSharedFiltersView,
    fixedWidth,
    inlineMode,
    isSharedFiltersOpened: _isSharedFiltersOpened,
  } = useColumnFilters()

  const isFiltersOpened = enableSharedFiltersView
    ? _isSharedFiltersOpened
    : _isLocalFiltersOpened

  const { appOrientation } = useAppLayout()

  const { appViewMode } = useAppViewMode()

  useEmitter(
    'TOGGLE_COLUMN_FILTERS',
    payload => {
      if (payload.columnId !== column.id) return
      if (enableSharedFiltersView) return
      setIsLocalFiltersOpened(v => !v)
    },
    [column.id, enableSharedFiltersView],
  )

  const { filteredItems } = useColumnData(column.id, { mergeSimilar: false })

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

  const fetchColumnSubscriptionRequest = useReduxAction(
    actions.fetchColumnSubscriptionRequest,
  )

  const refresh = useCallback(() => {
    fetchColumnSubscriptionRequest({
      columnId: column.id,
      params: { page: 1, perPage: getDefaultPaginationPerPage(column.type) },
      replaceAllItems: false,
    })
  }, [fetchColumnSubscriptionRequest, column.id])

  function focusColumn() {
    emitter.emit('FOCUS_ON_COLUMN', {
      columnId: column.id,
      highlight: false,
      scrollTo: false,
    })
  }

  const toggleFilters = () => {
    focusColumn()
    emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId: column.id })
  }

  const toggleOptions = () => {
    if (!columnOptionsRef.current) return

    focusColumn()
    columnOptionsRef.current.toggle()
  }

  const hasOneUnreadItem = (filteredItems as any[]).some(
    (
      item:
        | EnhancedGitHubNotification
        | EnhancedGitHubEvent
        | EnhancedGitHubIssueOrPullRequest,
    ) => !isItemRead(item),
  )

  const renderLeftSeparator =
    appViewMode === 'multi-column' &&
    !(columnIndex === 0 && appOrientation === 'landscape')

  const renderRightSeparator = appViewMode === 'multi-column'

  return (
    <Column
      key={`column-renderer-${column.id}-inner-container`}
      backgroundColor={getColumnCardThemeColors().column}
      columnId={column.id}
      fullWidth={appViewMode === 'single-column'}
      pagingEnabled={pagingEnabled}
      renderLeftSeparator={renderLeftSeparator}
      renderRightSeparator={renderRightSeparator}
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
          analyticsLabel={
            clearableItems.length ? 'clear_column' : 'unclear_column'
          }
          fixedIconSize
          iconName="check"
          onPress={() => {
            setColumnClearedAtFilter({
              columnId: column.id,
              clearedAt: clearableItems.length
                ? new Date().toISOString()
                : null,
            })

            focusColumn()

            if (!clearableItems.length) refresh()
          }}
          style={{
            paddingHorizontal: contentPadding / 3,
            opacity: clearableItems.length ? 1 : 0.5,
          }}
          tooltip={clearableItems.length ? 'Clear items' : 'Show cleared items'}
        />

        <ColumnHeaderItem
          key="column-options-button-toggle-mark-as-read"
          analyticsLabel={!hasOneUnreadItem ? 'mark_as_unread' : 'mark_as_read'}
          disabled={!filteredItems.length}
          fixedIconSize
          iconName={!hasOneUnreadItem ? 'mail-read' : 'mail'}
          onPress={() => {
            const unread = !hasOneUnreadItem

            const visibleItemIds = (filteredItems as any[]).map(
              (item: EnhancedItem) => item && item.id,
            )

            const hasAnyFilter = columnHasAnyFilter(column.type, {
              ...column.filters,
              clearedAt: undefined,
            })

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

        <ColumnHeaderItem
          key="column-options-toggle-button"
          analyticsAction="toggle"
          analyticsLabel="column_options"
          fixedIconSize
          iconName="gear"
          onPress={toggleOptions}
          style={{
            paddingHorizontal: contentPadding / 3,
          }}
          tooltip="Options"
        />
      </ColumnHeader>

      <ColumnOptionsAccordion ref={columnOptionsRef} columnId={column.id} />

      {!inlineMode && !enableSharedFiltersView && (
        <ColumnFiltersRenderer
          key="column-options-renderer"
          close={toggleFilters}
          columnId={column.id}
          fixedPosition="right"
          fixedWidth={fixedWidth}
          forceOpenAll
          isOpen={isFiltersOpened}
          shouldRenderHeader="yes"
        />
      )}

      {children({
        disableItemFocus: inlineMode ? false : isFiltersOpened,
        isFiltersOpened,
      })}

      {!!isFreeTrial && <FreeTrialHeaderMessage />}
    </Column>
  )
})

ColumnRenderer.displayName = 'ColumnRenderer'
