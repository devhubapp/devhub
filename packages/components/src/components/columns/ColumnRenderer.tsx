import {
  Column as ColumnT,
  columnHasAnyFilter,
  constants,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedItem,
  formatPriceAndInterval,
  getDateSmallText,
  getDefaultPaginationPerPage,
  getItemNodeIdOrId,
  isEventPrivate,
  isItemRead,
  isItemSaved,
  isNotificationPrivate,
  isPlanStatusValid,
  ThemeColors,
} from '@devhub/core'
import React, { useCallback, useRef } from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { useDispatch, useStore } from 'react-redux'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxState } from '../../hooks/use-redux-state'
import { AutoSizer } from '../../libs/auto-sizer'
import { emitter } from '../../libs/emitter'
import { IconProp } from '../../libs/vector-icons'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import {
  FreeTrialHeaderMessage,
  FreeTrialHeaderMessageProps,
} from '../common/FreeTrialHeaderMessage'
import { HeaderMessage } from '../common/HeaderMessage'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { useLoginHelpers } from '../context/LoginHelpersContext'
import { usePlans } from '../context/PlansContext'
import { Column } from './Column'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { ColumnHeader } from './ColumnHeader'
import { ColumnOptionsAccordion } from './ColumnOptionsAccordion'

export function getColumnCardThemeColors({ isDark }: { isDark: boolean }): {
  column: keyof ThemeColors
  card: keyof ThemeColors
  card__hover: keyof ThemeColors
  card__muted: keyof ThemeColors
  card__muted_hover: keyof ThemeColors
} {
  return {
    card: 'backgroundColorLighther1',
    card__hover: isDark ? 'backgroundColorLighther2' : 'backgroundColorDarker1',
    card__muted: isDark ? 'backgroundColor' : 'backgroundColorDarker1',
    card__muted_hover: isDark
      ? 'backgroundColorLighther1'
      : 'backgroundColorDarker2',
    column: 'backgroundColor',
  }
}

export function getCardBackgroundThemeColor({
  isDark,
  isMuted,
  isHovered,
}: {
  isDark: boolean
  isMuted: boolean
  isHovered?: boolean
}) {
  const backgroundThemeColors = getColumnCardThemeColors({ isDark })

  const _backgroundThemeColor =
    (isMuted &&
      (isHovered
        ? backgroundThemeColors.card__muted_hover
        : backgroundThemeColors.card__muted)) ||
    (isHovered ? backgroundThemeColors.card__hover : backgroundThemeColors.card)

  return _backgroundThemeColor
}

export interface ColumnRendererProps {
  avatarImageURL?: string
  avatarLinkURL?: string
  children: React.ReactNode
  columnId: string
  columnIndex: number
  columnType: ColumnT['type']
  icon: IconProp
  owner: string | undefined
  pagingEnabled?: boolean
  repo: string | undefined
  repoIsKnown: boolean
  subtitle: string | undefined
  title: string
}

export const ColumnRenderer = React.memo((props: ColumnRendererProps) => {
  const {
    avatarImageURL,
    avatarLinkURL,
    children,
    columnId,
    columnIndex,
    columnType,
    icon,
    owner,
    pagingEnabled,
    repo,
    repoIsKnown,
    subtitle,
    title,
  } = props

  const columnOptionsRef = useRef<ColumnOptionsAccordion>(null)
  const appLayout = useAppLayout()
  const { appOrientation } = appLayout
  const appViewModeresult = useAppViewMode()
  const { appViewMode } = appViewModeresult
  const columnWidth = useColumnWidth()
  const columnData = useColumnData(columnId, {
    mergeSimilar: false,
  })
  const { hasCrossedColumnsLimit, filteredItems } = columnData

  const dispatch = useDispatch()
  const store = useStore()

  const hasItemsToMarkAsDone = !!(filteredItems as any[]).some(
    (
      item:
        | EnhancedGitHubEvent
        | EnhancedGitHubNotification
        | EnhancedGitHubIssueOrPullRequest,
    ) => {
      return !!(item && !isItemSaved(item)) /* && isItemRead(item) */
    },
  )

  const refresh = useCallback(() => {
    dispatch(
      actions.fetchColumnSubscriptionRequest({
        columnId,
        params: { page: 1, perPage: getDefaultPaginationPerPage(columnType) },
        replaceAllItems: false,
      }),
    )
  }, [columnId])

  function focusColumn() {
    emitter.emit('FOCUS_ON_COLUMN', {
      columnId,
      highlight: false,
      scrollTo: false,
    })
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
      key={`column-renderer-${columnId}-inner-container`}
      backgroundColor={getColumnCardThemeColors({ isDark: false }).column}
      columnId={columnId}
      pagingEnabled={pagingEnabled}
      renderLeftSeparator={renderLeftSeparator}
      renderRightSeparator={renderRightSeparator}
    >
      <ColumnHeader
        key={`column-renderer-${columnId}-header`}
        columnId={columnId}
        title={title}
        subtitle={subtitle}
        style={{ paddingRight: contentPadding / 2 }}
        {...(avatarImageURL
          ? { avatar: { imageURL: avatarImageURL, linkURL: avatarLinkURL! } }
          : { icon })}
        right={
          <>
            <ColumnHeader.Button
              key="column-options-button-clear-column"
              analyticsLabel={
                hasItemsToMarkAsDone ? 'clear_column' : 'unclear_column'
              }
              disabled={hasCrossedColumnsLimit || !hasItemsToMarkAsDone}
              family="octicon"
              name="check"
              onPress={() => {
                dispatch(
                  actions.setColumnClearedAtFilter({
                    columnId,
                    clearedAt: hasItemsToMarkAsDone
                      ? new Date().toISOString()
                      : null,
                  }),
                )

                focusColumn()

                if (!hasItemsToMarkAsDone) refresh()
              }}
              tooltip="Done"
            />

            <ColumnHeader.Button
              key="column-options-button-toggle-mark-as-read"
              analyticsLabel={
                !hasOneUnreadItem ? 'mark_as_unread' : 'mark_as_read'
              }
              disabled={hasCrossedColumnsLimit || !filteredItems.length}
              family="octicon"
              name={!hasOneUnreadItem ? 'eye-closed' : 'eye'}
              onPress={() => {
                const unread = !hasOneUnreadItem

                const visibleItemNodeIdOrIds = (filteredItems as any[])
                  .map((item: EnhancedItem) => getItemNodeIdOrId(item))
                  .filter(Boolean) as string[]

                const column = selectors.columnSelector(
                  store.getState(),
                  columnId,
                )

                const hasAnyFilter = columnHasAnyFilter(columnType, {
                  ...(column && column.filters),
                  clearedAt: undefined,
                })

                // column doesnt have any filter,
                // so lets mark ALL notifications on github as read at once,
                // instead of marking only the visible items one by one
                if (
                  columnType === 'notifications' &&
                  !hasAnyFilter &&
                  !unread
                ) {
                  if (repoIsKnown) {
                    if (owner && repo) {
                      dispatch(
                        actions.markRepoNotificationsAsReadOrUnread({
                          owner,
                          repo,
                          unread,
                        }),
                      )

                      return
                    }
                  } else {
                    dispatch(
                      actions.markAllNotificationsAsReadOrUnread({ unread }),
                    )
                    return
                  }
                }

                // mark only the visible items as read/unread one by one
                dispatch(
                  actions.markItemsAsReadOrUnread({
                    type: columnType,
                    itemNodeIdOrIds: visibleItemNodeIdOrIds,
                    unread,
                  }),
                )

                focusColumn()
              }}
              tooltip={
                !hasOneUnreadItem ? 'Mark all as unread' : 'Mark all as read'
              }
            />

            <ColumnHeader.Button
              key="column-options-toggle-button"
              analyticsAction="toggle"
              analyticsLabel="column_options"
              family="octicon"
              name="settings"
              onPress={toggleOptions}
              tooltip="Options"
            />
          </>
        }
      />

      <View
        style={[
          sharedStyles.flex,
          sharedStyles.fullWidth,
          sharedStyles.fullHeight,
        ]}
      >
        <AutoSizer
          defaultWidth={columnWidth}
          defaultHeight={Dimensions.get('window').height}
          style={[
            sharedStyles.relative,
            sharedStyles.flex,
            sharedStyles.fullWidth,
            sharedStyles.fullHeight,
          ]}
        >
          {({ width, height }) => (
            <View style={StyleSheet.absoluteFill}>
              <ColumnOptionsAccordion
                ref={columnOptionsRef}
                columnId={columnId}
              />

              <View style={{ width, height }}>{children}</View>
            </View>
          )}
        </AutoSizer>
      </View>

      <ColumnFiltersRenderer
        key="column-options-renderer"
        columnId={columnId}
        fixedPosition="right"
        header="header"
        type="local"
      />

      <ColumnFooterHeaderMessage
        columnData={columnData}
        columnIndex={columnIndex}
        columnType={columnType}
      />
    </Column>
  )
})

ColumnRenderer.displayName = 'ColumnRenderer'

function ColumnFooterHeaderMessage({
  columnData,
  columnIndex,
  columnType,
}: {
  columnType: ColumnT['type']
  columnIndex: number
  columnData: ReturnType<typeof useColumnData>
}) {
  const { filteredItems } = columnData

  const { addPersonalAccessToken } = useLoginHelpers()

  const { cheapestPlanWithNotifications, paidPlans } = usePlans()
  const columnsCount = useReduxState(selectors.columnCountSelector)
  const plan = useReduxState(selectors.currentUserPlanSelector)
  const isPlanExpired = useReduxState(selectors.isPlanExpiredSelector)
  const personalTokenDetails = useReduxState(
    selectors.githubPersonalTokenDetailsSelector,
  )

  const showBannerForPaidFeature: FreeTrialHeaderMessageProps | undefined =
    isPlanExpired && plan && plan.trialEndAt && paidPlans.length
      ? {
          backgroundColor: 'backgroundColorDarker1',
          foregroundColor: 'foregroundColorMuted65',
          intervalRefresh: { date: plan.trialEndAt },
          message: () =>
            `${plan.amount ? 'Trial' : 'Free trial'} ${getDateSmallText(
              plan.trialEndAt,
              {
                pastPrefix: 'ended',
                futurePrefix: '',
                showPrefixOnFullDate: true,

                pastSuffix: 'ago',
                futureSuffix: 'left',
                showSuffixOnFullDate: false,
              },
            )}`,
        }
      : plan &&
        plan.featureFlags.columnsLimit >= 1 &&
        columnIndex + 1 > plan.featureFlags.columnsLimit
      ? columnIndex + 1 === plan.featureFlags.columnsLimit &&
        columnIndex + 1 === columnsCount &&
        columnIndex + 1 <= constants.COLUMNS_LIMIT
        ? {
            message: 'Columns limit reached. Tap for more.',
            relatedFeature: 'columnsLimit',
          }
        : undefined
      : (!(
          plan &&
          isPlanStatusValid(plan) &&
          plan.featureFlags.enablePrivateRepositories
        ) &&
          (columnType === 'activity'
            ? (filteredItems as any[]).some((item: EnhancedGitHubEvent) =>
                isEventPrivate(item),
              )
            : columnType === 'notifications'
            ? (filteredItems as any[]).some(
                (item: EnhancedGitHubNotification) =>
                  isNotificationPrivate(item) && !!item.enhanced,
              )
            : // TODO: Handle for IssueOrPullRequest Column
              undefined) && {
            message:
              cheapestPlanWithNotifications &&
              cheapestPlanWithNotifications.amount
                ? `Unlock private repos for ${formatPriceAndInterval(
                    cheapestPlanWithNotifications,
                  )}`
                : 'Tap to unlock Private Repositories',
            relatedFeature: 'enablePrivateRepositories',
          }) ||
        (plan &&
        plan.status === 'trialing' &&
        plan.trialEndAt &&
        !(plan.id === 'free' && !paidPlans.length) &&
        new Date(plan.trialEndAt).valueOf() - Date.now() <
          1000 * 60 * 60 * 24 * 14
          ? {
              intervalRefresh: { date: plan.trialEndAt },
              message: () =>
                `${plan.amount ? 'Trial' : 'Free trial'} (${getDateSmallText(
                  plan.trialEndAt,
                  {
                    pastPrefix: 'ended',
                    futurePrefix: '',
                    showPrefixOnFullDate: true,

                    pastSuffix: 'ago',
                    futureSuffix: 'left',
                    showSuffixOnFullDate: false,
                  },
                )})`,
            }
          : undefined)

  return !!showBannerForPaidFeature ? (
    <FreeTrialHeaderMessage {...showBannerForPaidFeature} />
  ) : columnType === 'notifications' && !personalTokenDetails?.token ? (
    <HeaderMessage
      analyticsLabel="pat_notifications_column"
      backgroundColor="backgroundColor"
      color="foregroundColorMuted65"
      onPress={() => {
        void addPersonalAccessToken()
      }}
    >
      Enable Private Repositories support
    </HeaderMessage>
  ) : null
}
