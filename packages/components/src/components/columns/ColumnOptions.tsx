import _ from 'lodash'
import React, { useState } from 'react'
import { Animated, ScrollView, StyleSheet, View } from 'react-native'

import { Column, GitHubIcon } from '@devhub/core/src/types'
import {
  eventTypes,
  getEventTypeMetadata,
} from '@devhub/core/src/utils/helpers/github/events'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useDimensions } from '../../hooks/use-dimensions'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
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
import { AnimatedIcon } from '../animated/AnimatedIcon'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Checkbox } from '../common/Checkbox'
import { fabSize } from '../common/FAB'
import { Spacer } from '../common/Spacer'
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
  column: Column
  columnIndex: number
}

export type ColumnOptionCategory =
  | 'cleared'
  | 'event_types'
  | 'inbox'
  | 'notification_types'
  | 'privacy'
  | 'unread'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const theme = useAnimatedTheme()
  const deleteColumn = useReduxAction(actions.deleteColumn)
  const dimensions = useDimensions()
  const { appOrientation, sizename } = useAppLayout()
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

  const { column, columnIndex } = props

  return (
    <Animated.View
      style={[
        styles.container,
        {
          maxHeight:
            dimensions.window.height -
            columnHeaderHeight -
            (horizontalSidebar ? sidebarSize : 0) -
            (isFabVisible ? fabSize + 2 * fabSpacing : 0),
          backgroundColor: theme.backgroundColorLess08,
        },
      ]}
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
                contentContainerStyle={{
                  marginVertical: -contentPadding / 4,
                  marginRight: contentPadding,
                }}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                iconName="check"
                onToggle={() =>
                  toggleOpenedOptionCategory('notification_types')
                }
                opened={openedOptionCategory === 'notification_types'}
                title="Notification reasons"
              >
                {notificationReasonOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.reason] === 'boolean'
                      ? filters[item.reason]
                      : null

                  return (
                    <Checkbox
                      key={`notification-reason-option-${item.reason}`}
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
                contentContainerStyle={{
                  marginVertical: -contentPadding / 4,
                  marginRight: contentPadding,
                }}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                iconName="check"
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
              contentContainerStyle={{ marginRight: contentPadding }}
              hasChanged={filterRecordHasAnyForcedValue(filters)}
              iconName={details.icon}
              onToggle={() => toggleOpenedOptionCategory('inbox')}
              opened={openedOptionCategory === 'inbox'}
              title={details.title}
            >
              <Checkbox
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
                contentContainerStyle={{ marginRight: contentPadding }}
                hasChanged={
                  !!(
                    column.filters && typeof column.filters.unread === 'boolean'
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
          const isPrivateChecked = !(
            column.filters && column.filters.private === false
          )

          const isPublicChecked = !(
            column.filters && column.filters.private === true
          )

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
              contentContainerStyle={{ marginRight: contentPadding }}
              hasChanged={
                !!(
                  column.filters && typeof column.filters.private === 'boolean'
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
                checked={isPublicChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isPublicChecked && !isPrivateChecked}
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
                checked={isPrivateChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isPrivateChecked && !isPublicChecked}
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
            iconName="chevron-left"
            onPress={() =>
              moveColumn({ columnId: column.id, columnIndex: columnIndex - 1 })
            }
          />
          <ColumnHeaderItem
            iconName="chevron-right"
            onPress={() =>
              moveColumn({ columnId: column.id, columnIndex: columnIndex + 1 })
            }
          />

          <Spacer flex={1} />

          {!!column.filters &&
            !!column.filters.clearedAt &&
            ((column.filters.inbox && column.filters.inbox.archived) ===
            true ? (
              <ColumnHeaderItem
                iconName="archive"
                onPress={() =>
                  clearArchivedItems({
                    clearedAt: column.filters!.clearedAt!,
                    subscriptionIds: column.subscriptionIds,
                  })
                }
                text="Clear archived"
              />
            ) : (
              <ColumnHeaderItem
                iconName="circle-slash"
                iconStyle={
                  column.filters && column.filters.clearedAt
                    ? { color: colors.brandBackgroundColor }
                    : undefined
                }
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
            ))}

          <ColumnHeaderItem
            iconName="trashcan"
            onPress={() => deleteColumn(column.id)}
            text="Remove"
          />
        </View>
      </ScrollView>
      <CardItemSeparator />
    </Animated.View>
  )
}
