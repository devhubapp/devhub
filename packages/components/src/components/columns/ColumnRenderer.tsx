import { getLuminance } from 'polished'
import React, { useCallback, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'

import {
  CardViewMode,
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
import { useRepoTableColumnWidth } from '../../hooks/use-repo-table-column-width'
import { emitter } from '../../libs/emitter'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderHeight,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import { CardBorder } from '../cards/partials/CardBorder'
import { FreeTrialHeaderMessage } from '../common/FreeTrialHeaderMessage'
import { separatorSize } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'
import { getColumnSeparatorSize } from './ColumnSeparator'

export function getColumnCardThemeColors(
  backgroundColor: string,
): {
  column: keyof ThemeColors
  card: keyof ThemeColors
  card__hover: keyof ThemeColors
  card__muted: keyof ThemeColors
  card__muted_hover: keyof ThemeColors
} {
  const luminance = getLuminance(backgroundColor)

  if (luminance <= 0.01) {
    return {
      card: 'backgroundColorLighther3',
      card__hover: 'backgroundColorLighther4',
      card__muted: 'backgroundColor',
      card__muted_hover: 'backgroundColorLighther2',
      column: 'backgroundColor',
    }
  }

  if (luminance >= 0.6) {
    return {
      card: 'backgroundColorLighther1',
      card__hover: 'backgroundColorLighther2',
      card__muted: 'backgroundColorDarker1',
      card__muted_hover: 'backgroundColorDarker2',
      column: 'backgroundColor',
    }
  }

  return {
    card: 'backgroundColorLighther2',
    card__hover: 'backgroundColorLighther3',
    card__muted: 'backgroundColorDarker1',
    card__muted_hover: 'backgroundColorDarker2',
    column: 'backgroundColor',
  }
}

export function getCardBackgroundThemeColor(
  theme: ThemeColors,
  { muted }: { muted: boolean },
) {
  const backgroundThemeColors = getColumnCardThemeColors(theme.backgroundColor)

  const _backgroundThemeColor =
    // (isFocused && 'backgroundColorLess2') ||
    (muted && backgroundThemeColors.card__muted) || backgroundThemeColors.card

  return _backgroundThemeColor
}

export interface ColumnRendererProps {
  avatarRepo?: string
  avatarUsername?: string
  children: (p: {
    cardViewMode: CardViewMode
    disableItemFocus: boolean
    enableCompactLabels: boolean
    isFiltersOpened: boolean
  }) => React.ReactNode
  column: ColumnType
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
    fixedWidth,
    inlineMode,
    isSharedFiltersOpened: _isSharedFiltersOpened,
  } = useColumnFilters()
  const isFiltersOpened = enableSharedFiltersView
    ? _isSharedFiltersOpened
    : _isLocalFiltersOpened

  const { appOrientation, sizename } = useAppLayout()
  const {
    appViewMode,
    getCardViewMode,
    getEnableCompactLabels,
  } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const columnWidth = useColumnWidth()
  const repoTableColumnWidth = useRepoTableColumnWidth()

  const columnRef = useRef<View>(null)
  useTheme(undefined, theme => {
    if (!columnRef.current) return

    columnRef.current!.setNativeProps({
      style: {
        backgroundColor:
          theme[getColumnCardThemeColors(theme.backgroundColor).column],
      },
    })
  })

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

  const estimatedContainerHeight =
    appOrientation === 'portrait'
      ? Dimensions.get('window').height - columnHeaderHeight - sidebarSize - 2
      : Dimensions.get('window').height - columnHeaderHeight - 1

  const estimatedInitialCardWidth =
    appViewMode === 'multi-column'
      ? columnWidth - getColumnSeparatorSize()
      : Dimensions.get('window').width -
        (enableSharedFiltersView && inlineMode
          ? fixedWidth + getColumnSeparatorSize()
          : 0) -
        (appOrientation !== 'portrait'
          ? sidebarSize + getColumnSeparatorSize()
          : sizename === '1-small'
          ? 0
          : separatorSize)

  return (
    <Column
      key={`column-renderer-${column.id}-inner-container`}
      ref={columnRef}
      columnId={column.id}
      fullWidth={appViewMode === 'single-column'}
      pagingEnabled={pagingEnabled}
      renderSideSeparators={appViewMode === 'multi-column'}
    >
      <ColumnHeader key={`column-renderer-${column.id}-header`}>
        {Platform.realOS === 'web' &&
          filteredItems.length === 0 &&
          focusedColumnId === column.id &&
          appViewMode === 'multi-column' && <CardBorder />}

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
          enableForegroundHover={!!clearableItems.length}
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
          enableForegroundHover
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
        initialResult={estimatedContainerHeight}
        mapper={({ height }) => height}
        style={sharedStyles.flex}
      >
        {(containerHeight: number) => (
          <>
            {!disableColumnOptions && !enableSharedFiltersView && (
              <ColumnOptionsRenderer
                key="column-options-renderer"
                close={toggleOptions}
                columnId={column.id}
                containerHeight={containerHeight}
                fixedPosition="right"
                fixedWidth={fixedWidth}
                forceOpenAll
                isOpen={isFiltersOpened}
              />
            )}

            <View style={sharedStyles.flex}>
              <ViewMeasurer
                key="column-renderer-view-measurer"
                initialResult={{
                  width: estimatedInitialCardWidth,
                  cardViewMode: getCardViewMode(estimatedInitialCardWidth),
                  enableCompactLabels: getEnableCompactLabels(
                    estimatedInitialCardWidth,
                    repoTableColumnWidth,
                  ),
                }}
                mapper={({ width }) => ({
                  width,
                  cardViewMode: getCardViewMode(width),
                  enableCompactLabels: getEnableCompactLabels(
                    width,
                    repoTableColumnWidth,
                  ),
                })}
                style={sharedStyles.flex}
              >
                {({
                  cardViewMode,
                  enableCompactLabels,
                }: {
                  cardViewMode: CardViewMode
                  enableCompactLabels: boolean
                }) =>
                  children({
                    cardViewMode,
                    disableItemFocus: inlineMode ? false : isFiltersOpened,
                    enableCompactLabels,
                    isFiltersOpened,
                  })
                }
              </ViewMeasurer>

              {!!isFreeTrial && <FreeTrialHeaderMessage />}
            </View>
          </>
        )}
      </ViewMeasurer>
    </Column>
  )
})
