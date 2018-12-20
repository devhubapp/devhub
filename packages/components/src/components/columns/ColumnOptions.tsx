import _ from 'lodash'
import React, { useState } from 'react'
import { Animated, ScrollView, StatusBar, StyleSheet, View } from 'react-native'

import {
  Column,
  eventTypes,
  getEventTypeMetadata,
  GitHubIcon,
} from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useDimensions } from '../../hooks/use-dimensions'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { useReduxState } from '../../redux/hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import * as colors from '../../styles/colors'
import {
  columnHeaderHeight,
  contentPadding,
  sidebarSize,
} from '../../styles/variables'
import {
  filterRecordHasAnyForcedValue,
  filterRecordHasThisValue,
} from '../../utils/helpers/filters'
import {
  getNotificationReasonMetadata,
  notificationReasons,
} from '../../utils/helpers/github/notifications'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Checkbox } from '../common/Checkbox'
import { fabSize } from '../common/FAB'
import { Spacer } from '../common/Spacer'
import { AnimatedTransparentTextOverlay } from '../common/TransparentTextOverlay'
import { useAppLayout } from '../context/LayoutContext'
import { fabSpacing } from '../layout/FABRenderer'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRow } from './ColumnOptionsRow'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  innerContainer: {},
})

const notificationReasonOptions = notificationReasons
  .map(getNotificationReasonMetadata)
  .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

const eventTypeOptions = eventTypes
  .map(getEventTypeMetadata)
  .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

export interface ColumnOptionsProps {
  availableHeight: number
  column: Column
  columnIndex: number
}

export type ColumnOptionCategory =
  | 'cleared'
  | 'event_types'
  | 'inbox'
  | 'notification_reasons'
  | 'privacy'
  | 'unread'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const theme = useAnimatedTheme()
  const dimensions = useDimensions()
  const { appOrientation, sizename } = useAppLayout()

  const hasPrivateAccess = useReduxState(
    selectors.githubHasPrivateAccessSelector,
  )

  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
  const clearArchivedItems = useReduxAction(actions.clearArchivedItems)
  const setColumnInboxFilter = useReduxAction(actions.setColumnInboxFilter)
  const setColumnActivityTypeFilter = useReduxAction(
    actions.setColumnActivityTypeFilter,
  )
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColumnUnreadFilter = useReduxAction(actions.setColumnUnreadFilter)

  const horizontalSidebar = appOrientation === 'portrait'
  const isFabVisible = sizename === '1-small'

  const toggleOpenedOptionCategory = (
    optionCategory: ColumnOptionCategory | null,
  ) =>
    setOpenedOptionCategory(
      optionCategory === openedOptionCategory ? null : optionCategory,
    )

  const { availableHeight: _availableHeight, column, columnIndex } = props

  const availableHeight =
    _availableHeight ||
    dimensions.window.height -
      columnHeaderHeight -
      (horizontalSidebar ? sidebarSize : 0) -
      (StatusBar.currentHeight || 0)

  return (
    <Animated.View
      style={[
        styles.container,
        {
          maxHeight:
            availableHeight - (isFabVisible ? fabSize + 2 * fabSpacing : 0),
          backgroundColor: theme.backgroundColorLess08,
        },
      ]}
    >
      <AnimatedTransparentTextOverlay
        containerStyle={{ flex: 0 }}
        from="vertical"
        size={contentPadding}
        themeColor="backgroundColorLess08"
      >
        <ScrollView alwaysBounceVertical={false} style={styles.innerContainer}>
          {column.type === 'notifications' &&
            (() => {
              const filters =
                column.filters &&
                column.filters.notifications &&
                column.filters.notifications.reasons

              const defaultBooleanValue = true
              const isFilterStrict = filterRecordHasThisValue(
                filters,
                defaultBooleanValue,
              )

              return (
                <ColumnOptionsRow
                  analyticsLabel="notification_reasons"
                  contentContainerStyle={{
                    marginVertical: -contentPadding / 4,
                    marginRight: contentPadding,
                  }}
                  hasChanged={filterRecordHasAnyForcedValue(filters)}
                  iconName="rss"
                  onToggle={() =>
                    toggleOpenedOptionCategory('notification_reasons')
                  }
                  opened={openedOptionCategory === 'notification_reasons'}
                  title="Subscription reasons"
                >
                  {notificationReasonOptions.map(item => {
                    const checked =
                      filters && typeof filters[item.reason] === 'boolean'
                        ? filters[item.reason]
                        : null

                    return (
                      <Checkbox
                        key={`notification-reason-option-${item.reason}`}
                        analyticsLabel={undefined}
                        checked={checked}
                        checkedBackgroundColor={item.color}
                        checkedForegroundColor={theme.backgroundColorDarker08}
                        containerStyle={{
                          flexGrow: 1,
                          paddingVertical: contentPadding / 4,
                        }}
                        defaultValue={defaultBooleanValue}
                        enableTrippleState={
                          !isFilterStrict || checked === defaultBooleanValue
                        }
                        label={item.label}
                        onChange={value => {
                          setColumnReasonFilter({
                            columnId: column.id,
                            reason: item.reason,
                            value,
                          })
                        }}
                        uncheckedForegroundColor={item.color}
                      />
                    )
                  })}
                </ColumnOptionsRow>
              )
            })()}

          {column.type === 'activity' &&
            (() => {
              const filters =
                column.filters &&
                column.filters.activity &&
                column.filters.activity.types

              const defaultBooleanValue = true
              const isFilterStrict = filterRecordHasThisValue(
                filters,
                defaultBooleanValue,
              )

              return (
                <ColumnOptionsRow
                  analyticsLabel="event_types"
                  contentContainerStyle={{
                    marginVertical: -contentPadding / 4,
                    marginRight: contentPadding,
                  }}
                  hasChanged={filterRecordHasAnyForcedValue(filters)}
                  iconName="note"
                  onToggle={() => toggleOpenedOptionCategory('event_types')}
                  opened={openedOptionCategory === 'event_types'}
                  title="Event types"
                >
                  {eventTypeOptions.map(item => {
                    const checked =
                      filters && typeof filters[item.type] === 'boolean'
                        ? filters[item.type]
                        : null

                    return (
                      <Checkbox
                        key={`event-type-option-${item.type}`}
                        analyticsLabel={undefined}
                        checked={checked}
                        containerStyle={{
                          flexGrow: 1,
                          paddingVertical: contentPadding / 4,
                        }}
                        defaultValue={defaultBooleanValue}
                        enableTrippleState={
                          !isFilterStrict || checked === defaultBooleanValue
                        }
                        label={item.label}
                        labelIcon={item.icon}
                        onChange={value => {
                          setColumnActivityTypeFilter({
                            columnId: column.id,
                            type: item.type,
                            value,
                          })
                        }}
                      />
                    )
                  })}
                </ColumnOptionsRow>
              )
            })()}

          {(() => {
            const filters = (column.filters && column.filters.inbox) || {}

            const showInbox = filters.inbox !== false
            const showSaveForLater = filters.saved !== false
            const showArchived = filters.archived === true

            const savedForLaterTitle = 'Saved for later'
            const details: { title: string; icon: GitHubIcon } = showArchived
              ? {
                  title: `Archived${
                    showSaveForLater ? ` + ${savedForLaterTitle}` : ''
                  }`,
                  icon: 'archive',
                }
              : !showInbox && showSaveForLater
              ? { title: savedForLaterTitle, icon: 'bookmark' }
              : {
                  title: `Inbox${
                    showSaveForLater ? ` + ${savedForLaterTitle}` : ''
                  }`,
                  icon: 'inbox',
                }

            return (
              <ColumnOptionsRow
                analyticsLabel="inbox"
                contentContainerStyle={{ marginRight: contentPadding }}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                iconName={details.icon}
                onToggle={() => toggleOpenedOptionCategory('inbox')}
                opened={openedOptionCategory === 'inbox'}
                title={details.title}
              >
                <Checkbox
                  analyticsLabel="inbox"
                  checked={showInbox}
                  circle
                  disabled={showInbox && (!showSaveForLater && !showArchived)}
                  containerStyle={{ flexGrow: 1 }}
                  label="Inbox"
                  labelIcon="inbox"
                  onChange={checked => {
                    setColumnInboxFilter({
                      columnId: column.id,
                      inbox: !!checked,
                      ...(!!checked && {
                        archived: false,
                      }),
                    })
                  }}
                />

                <Spacer height={contentPadding / 2} />

                <Checkbox
                  analyticsLabel="archived"
                  checked={showArchived}
                  circle
                  containerStyle={{ flexGrow: 1 }}
                  label="Archived"
                  labelIcon="archive"
                  onChange={checked => {
                    setColumnInboxFilter({
                      columnId: column.id,
                      archived: !!checked,
                      ...(!!checked && {
                        inbox: false,
                      }),
                    })
                  }}
                />

                <Spacer height={contentPadding / 2} />

                <Checkbox
                  analyticsLabel="save_for_later"
                  checked={showSaveForLater}
                  containerStyle={{ flexGrow: 1 }}
                  label="Saved for later"
                  labelIcon="bookmark"
                  onChange={checked => {
                    setColumnInboxFilter({
                      columnId: column.id,
                      saved: !!checked,
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}

          {column.type === 'notifications' &&
            (() => {
              const isReadChecked = !(
                column.filters && column.filters.unread === true
              )

              const isUnreadChecked = !(
                column.filters && column.filters.unread === false
              )

              const getFilterValue = (read?: boolean, unread?: boolean) =>
                read && unread ? undefined : read ? false : unread

              return (
                <ColumnOptionsRow
                  analyticsLabel="read_status"
                  contentContainerStyle={{ marginRight: contentPadding }}
                  hasChanged={
                    !!(
                      column.filters &&
                      typeof column.filters.unread === 'boolean'
                    )
                  }
                  iconName={
                    column.filters && column.filters.unread === true
                      ? 'mail'
                      : 'mail-read'
                  }
                  onToggle={() => toggleOpenedOptionCategory('unread')}
                  opened={openedOptionCategory === 'unread'}
                  title="Read status"
                >
                  <Checkbox
                    analyticsLabel="read"
                    checked={isReadChecked}
                    containerStyle={{ flexGrow: 1 }}
                    disabled={isReadChecked && !isUnreadChecked}
                    label="Read"
                    // labelIcon="mail-read"
                    onChange={checked => {
                      setColumnUnreadFilter({
                        columnId: column.id,
                        unread: getFilterValue(!!checked, isUnreadChecked),
                      })
                    }}
                  />

                  <Spacer height={contentPadding / 2} />

                  <Checkbox
                    analyticsLabel="unread"
                    checked={isUnreadChecked}
                    containerStyle={{ flexGrow: 1 }}
                    disabled={isUnreadChecked && !isReadChecked}
                    label="Unread"
                    // labelIcon="mail"
                    onChange={checked => {
                      setColumnUnreadFilter({
                        columnId: column.id,
                        unread: getFilterValue(isReadChecked, !!checked),
                      })
                    }}
                  />
                </ColumnOptionsRow>
              )
            })()}

          {(() => {
            const isPrivateChecked =
              column.type === 'notifications'
                ? !(column.filters && column.filters.private === false)
                : hasPrivateAccess &&
                  !(column.filters && column.filters.private === false)

            const isPublicChecked = !(
              column.filters && column.filters.private === true
            )

            const canShowPrivateContent =
              hasPrivateAccess || column.type === 'notifications'

            if (!canShowPrivateContent && !isPrivateChecked) return null

            const getFilterValue = (
              showPublic?: boolean,
              showPrivate?: boolean,
            ) =>
              showPublic && showPrivate
                ? undefined
                : showPublic
                ? false
                : showPrivate

            return (
              <ColumnOptionsRow
                analyticsLabel="privacy"
                contentContainerStyle={{ marginRight: contentPadding }}
                hasChanged={
                  !!(
                    column.filters &&
                    ((hasPrivateAccess &&
                      typeof column.filters.private === 'boolean') ||
                      (!hasPrivateAccess && column.filters.private === true))
                  )
                }
                iconName={
                  column.filters && column.filters.private === false
                    ? 'globe'
                    : 'lock'
                }
                onToggle={() => toggleOpenedOptionCategory('privacy')}
                opened={openedOptionCategory === 'privacy'}
                title="Privacy"
              >
                <Checkbox
                  analyticsLabel="public"
                  checked={isPublicChecked}
                  containerStyle={{ flexGrow: 1 }}
                  disabled={
                    isPublicChecked &&
                    (!isPrivateChecked || !canShowPrivateContent)
                  }
                  label="Public"
                  // labelIcon="globe"
                  onChange={checked => {
                    setColumnPrivacyFilter({
                      columnId: column.id,
                      private: getFilterValue(!!checked, isPrivateChecked),
                    })
                  }}
                />

                <Spacer height={contentPadding / 2} />

                <Checkbox
                  analyticsLabel="private"
                  checked={isPrivateChecked}
                  containerStyle={{ flexGrow: 1 }}
                  disabled={
                    (isPrivateChecked && !isPublicChecked) ||
                    (!isPrivateChecked && !canShowPrivateContent)
                  }
                  label="Private"
                  // labelIcon="lock"
                  onChange={checked => {
                    setColumnPrivacyFilter({
                      columnId: column.id,
                      private: getFilterValue(isPublicChecked, !!checked),
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}

          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: contentPadding / 2,
            }}
          >
            <ColumnHeaderItem
              analyticsLabel="move_column_left"
              iconName="chevron-left"
              onPress={() =>
                moveColumn({
                  columnId: column.id,
                  columnIndex: columnIndex - 1,
                })
              }
            />
            <ColumnHeaderItem
              analyticsLabel="move_column_right"
              iconName="chevron-right"
              onPress={() =>
                moveColumn({
                  columnId: column.id,
                  columnIndex: columnIndex + 1,
                })
              }
            />

            <Spacer flex={1} />

            {!!column.filters &&
            !!column.filters.clearedAt &&
            (column.filters.inbox && column.filters.inbox.archived) === true ? (
              <ColumnHeaderItem
                analyticsLabel="delete_archived"
                iconName="archive"
                iconStyle={{ color: colors.lightRed }}
                onPress={() =>
                  clearArchivedItems({
                    clearedAt: column.filters!.clearedAt!,
                    subscriptionIds: column.subscriptionIds,
                  })
                }
                text="Delete archived"
              />
            ) : (
              <ColumnHeaderItem
                analyticsLabel={
                  column.filters && column.filters.clearedAt
                    ? 'unclear-column'
                    : 'clear-column'
                }
                iconName={
                  column.filters && column.filters.clearedAt
                    ? 'history'
                    : 'tasklist'
                }
                iconStyle={{ color: colors.brandBackgroundColor }}
                onPress={() =>
                  setColumnClearedAtFilter({
                    columnId: column.id,
                    clearedAt:
                      column.filters && column.filters.clearedAt
                        ? null
                        : new Date().toISOString(),
                  })
                }
                text={
                  column.filters && column.filters.clearedAt
                    ? 'Unclear'
                    : 'Clear'
                }
              />
            )}

            <ColumnHeaderItem
              analyticsLabel="remove_column"
              iconName="trashcan"
              iconStyle={{ color: colors.lightRed }}
              onPress={() => deleteColumn({ columnId: column.id, columnIndex })}
              text="Remove"
            />
          </View>
        </ScrollView>
      </AnimatedTransparentTextOverlay>
      <CardItemSeparator />
    </Animated.View>
  )
}
