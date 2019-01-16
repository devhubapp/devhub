import _ from 'lodash'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { Column, eventTypes, getEventTypeMetadata } from '@devhub/core'
import { useAnimatedTheme } from '../../hooks/use-animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { contentPadding } from '../../styles/variables'
import {
  filterRecordHasAnyForcedValue,
  filterRecordHasThisValue,
} from '../../utils/helpers/filters'
import {
  getNotificationReasonMetadata,
  notificationReasons,
} from '../../utils/helpers/github/notifications'
import { AnimatedView } from '../animated/AnimatedView'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Checkbox } from '../common/Checkbox'
import { Spacer } from '../common/Spacer'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRow } from './ColumnOptionsRow'

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  scrollContainer: {},
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
  | 'notification_reasons'
  | 'privacy'
  | 'saved_for_later'
  | 'unread'

export function ColumnOptions(props: ColumnOptionsProps) {
  const [
    openedOptionCategory,
    setOpenedOptionCategory,
  ] = useState<ColumnOptionCategory | null>(null)
  const theme = useAnimatedTheme()

  const hasPrivateAccess = useReduxState(
    selectors.githubHasPrivateAccessSelector,
  )

  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnSavedFilter = useReduxAction(actions.setColumnSavedFilter)
  const setColumnActivityTypeFilter = useReduxAction(
    actions.setColumnActivityTypeFilter,
  )
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColumnUnreadFilter = useReduxAction(actions.setColumnUnreadFilter)

  const toggleOpenedOptionCategory = (
    optionCategory: ColumnOptionCategory | null,
  ) =>
    setOpenedOptionCategory(
      optionCategory === openedOptionCategory ? null : optionCategory,
    )

  const { availableHeight, column, columnIndex } = props

  return (
    <AnimatedView
      style={[
        styles.container,
        { backgroundColor: theme.backgroundColorLess08 },
      ]}
    >
      <ScrollView
        alwaysBounceVertical={false}
        style={[styles.scrollContainer, { maxHeight: availableHeight }]}
      >
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
                      enableIndeterminateState={
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
                      enableIndeterminateState={
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
          const savedForLater = column.filters && column.filters.saved

          return (
            <ColumnOptionsRow
              analyticsLabel="saved_for_later"
              hasChanged={typeof savedForLater === 'boolean'}
              iconName="bookmark"
              onToggle={() => toggleOpenedOptionCategory('saved_for_later')}
              opened={openedOptionCategory === 'saved_for_later'}
              subtitle={
                savedForLater === true
                  ? 'Saved only'
                  : savedForLater === false
                  ? 'Saved excluded'
                  : ''
              }
              title="Saved for later"
            >
              <Checkbox
                analyticsLabel="save_for_later"
                checked={
                  typeof savedForLater === 'boolean' ? savedForLater : null
                }
                containerStyle={{ flexGrow: 1 }}
                enableIndeterminateState
                label="Saved for later"
                onChange={checked => {
                  setColumnSavedFilter({
                    columnId: column.id,
                    saved: checked,
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
                subtitle={
                  isReadChecked && !isUnreadChecked
                    ? 'Read only'
                    : !isReadChecked && isUnreadChecked
                    ? 'Unread only'
                    : ''
                }
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
              hasChanged={
                !!column.filters && typeof column.filters.private === 'boolean'
              }
              iconName={
                column.filters && column.filters.private === false
                  ? 'globe'
                  : 'lock'
              }
              onToggle={() => toggleOpenedOptionCategory('privacy')}
              opened={openedOptionCategory === 'privacy'}
              subtitle={
                isPrivateChecked && !isPublicChecked
                  ? 'Private only'
                  : !isPrivateChecked && isPublicChecked
                  ? 'Public only'
                  : undefined
              }
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
            enableForegroundHover
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
            enableForegroundHover
            iconName="chevron-right"
            onPress={() =>
              moveColumn({
                columnId: column.id,
                columnIndex: columnIndex + 1,
              })
            }
          />

          <Spacer flex={1} />

          <ColumnHeaderItem
            analyticsLabel="remove_column"
            enableForegroundHover
            iconName="trashcan"
            onPress={() => deleteColumn({ columnId: column.id, columnIndex })}
            text="Remove"
          />
        </View>
      </ScrollView>
      <CardItemSeparator />
    </AnimatedView>
  )
}
