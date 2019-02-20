import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'

import {
  Column,
  eventTypes,
  getEventTypeMetadata,
  isReadFilterChecked,
  isUnreadFilterChecked,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { columnHeaderHeight, contentPadding } from '../../styles/variables'
import {
  filterRecordHasAnyForcedValue,
  filterRecordHasThisValue,
} from '../../utils/helpers/filters'
import {
  getNotificationReasonMetadata,
  notificationReasons,
} from '../../utils/helpers/github/notifications'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { SpringAnimatedCheckbox } from '../common/Checkbox'
import { Spacer } from '../common/Spacer'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRow } from './ColumnOptionsRow'

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
  startWithFiltersExpanded?: boolean
}

export type ColumnOptionCategory =
  | 'event_types'
  | 'inbox'
  | 'notification_reasons'
  | 'privacy'
  | 'saved_for_later'
  | 'unread'

export const ColumnOptions = React.memo((props: ColumnOptionsProps) => {
  const { availableHeight, column, columnIndex } = props
  const { startWithFiltersExpanded = availableHeight >= 800 } = props

  const _allColumnOptionCategories: Array<ColumnOptionCategory | false> = [
    column.type === 'notifications' && 'inbox',
    column.type === 'activity' && 'event_types',
    column.type === 'notifications' && 'notification_reasons',
    'privacy',
    'saved_for_later',
    'unread',
  ]

  const allColumnOptionCategories = _allColumnOptionCategories.filter(
    Boolean,
  ) as ColumnOptionCategory[]

  const [openedOptionCategories, setOpenedOptionCategories] = useState(
    () =>
      new Set<ColumnOptionCategory>(
        startWithFiltersExpanded ? allColumnOptionCategories : [],
      ),
  )

  const allIsOpen =
    openedOptionCategories.size === allColumnOptionCategories.length
  const allowOnlyOneCategoryToBeOpenedRef = useRef(!allIsOpen)
  const allowToggleCategoriesRef = useRef(true)

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const hasPrivateAccess = useReduxState(
    selectors.githubHasPrivateAccessSelector,
  )

  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnSavedFilter = useReduxAction(actions.setColumnSavedFilter)
  const setColumnParticipatingFilter = useReduxAction(
    actions.setColumnParticipatingFilter,
  )
  const setColumnActivityTypeFilter = useReduxAction(
    actions.setColumnActivityTypeFilter,
  )
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColumnUnreadFilter = useReduxAction(actions.setColumnUnreadFilter)

  const toggleOpenedOptionCategory = (optionCategory: ColumnOptionCategory) => {
    setOpenedOptionCategories(set => {
      const isOpen = set.has(optionCategory)
      if (allowOnlyOneCategoryToBeOpenedRef.current) set.clear()
      isOpen ? set.delete(optionCategory) : set.add(optionCategory)

      if (set.size === 0) allowOnlyOneCategoryToBeOpenedRef.current = true

      return new Set(set)
    })
  }

  return (
    <SpringAnimatedView
      style={{
        alignSelf: 'stretch',
        backgroundColor: springAnimatedTheme.backgroundColorLess1,
      }}
    >
      <ScrollView
        alwaysBounceVertical={false}
        style={{ maxHeight: availableHeight - columnHeaderHeight - 4 }}
      >
        {column.type === 'notifications' &&
          (() => {
            const participating =
              column.filters &&
              column.filters.notifications &&
              column.filters.notifications.participating

            return (
              <ColumnOptionsRow
                analyticsLabel="inbox"
                hasChanged={!!participating}
                iconName="inbox"
                isOpen={openedOptionCategories.has('inbox')}
                onToggle={
                  allowToggleCategoriesRef.current
                    ? () => toggleOpenedOptionCategory('inbox')
                    : undefined
                }
                subtitle={participating ? 'Participating' : 'All'}
                title="Inbox"
              >
                <SpringAnimatedCheckbox
                  analyticsLabel="all_notifications"
                  checked={!participating}
                  circle
                  containerStyle={{
                    flexGrow: 1,
                    paddingVertical: contentPadding / 4,
                  }}
                  label="All"
                  onChange={checked => {
                    setColumnParticipatingFilter({
                      columnId: column.id,
                      participating: !checked,
                    })
                  }}
                />
                <SpringAnimatedCheckbox
                  analyticsLabel="participating_notifications"
                  checked={participating}
                  circle
                  containerStyle={{
                    flexGrow: 1,
                    paddingVertical: contentPadding / 4,
                  }}
                  label="Participating"
                  onChange={checked => {
                    setColumnParticipatingFilter({
                      columnId: column.id,
                      participating: !!checked,
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}

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
                isOpen={openedOptionCategories.has('notification_reasons')}
                onToggle={
                  allowToggleCategoriesRef.current
                    ? () => toggleOpenedOptionCategory('notification_reasons')
                    : undefined
                }
                title="Subscription reasons"
                subtitle={
                  filterRecordHasAnyForcedValue(filters) ? undefined : 'All'
                }
              >
                {notificationReasonOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.reason] === 'boolean'
                      ? filters[item.reason]
                      : null

                  return (
                    <SpringAnimatedCheckbox
                      key={`notification-reason-option-${item.reason}`}
                      analyticsLabel={undefined}
                      checked={checked}
                      checkedBackgroundColor={item.color}
                      checkedForegroundColor={
                        springAnimatedTheme.backgroundColorDarker1
                      }
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
                isOpen={openedOptionCategories.has('event_types')}
                onToggle={
                  allowToggleCategoriesRef.current
                    ? () => toggleOpenedOptionCategory('event_types')
                    : undefined
                }
                title="Event types"
                subtitle={
                  filterRecordHasAnyForcedValue(filters) ? undefined : 'All'
                }
              >
                {eventTypeOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.type] === 'boolean'
                      ? filters[item.type]
                      : null

                  return (
                    <SpringAnimatedCheckbox
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
              isOpen={openedOptionCategories.has('saved_for_later')}
              onToggle={
                allowToggleCategoriesRef.current
                  ? () => toggleOpenedOptionCategory('saved_for_later')
                  : undefined
              }
              subtitle={
                savedForLater === true
                  ? 'Only'
                  : savedForLater === false
                  ? 'Excluded'
                  : 'Included'
              }
              title="Saved for later"
            >
              <SpringAnimatedCheckbox
                analyticsLabel="save_for_later"
                checked={
                  typeof savedForLater === 'boolean' ? savedForLater : null
                }
                containerStyle={{
                  flexGrow: 1,
                  paddingVertical: contentPadding / 4,
                }}
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

        {(() => {
          const isReadChecked = isReadFilterChecked(column.filters)
          const isUnreadChecked = isUnreadFilterChecked(column.filters)

          function getUnreadFilterValue(read?: boolean, unread?: boolean) {
            return read && unread ? undefined : read ? false : unread
          }

          return (
            <ColumnOptionsRow
              analyticsLabel="read_status"
              hasChanged={
                !!(column.filters && typeof column.filters.unread === 'boolean')
              }
              iconName={
                column.filters && column.filters.unread === true
                  ? 'mail'
                  : 'mail-read'
              }
              isOpen={openedOptionCategories.has('unread')}
              onToggle={
                allowToggleCategoriesRef.current
                  ? () => toggleOpenedOptionCategory('unread')
                  : undefined
              }
              subtitle={
                isReadChecked && !isUnreadChecked
                  ? 'Read'
                  : !isReadChecked && isUnreadChecked
                  ? 'Unread'
                  : 'All'
              }
              title="Read status"
            >
              <SpringAnimatedCheckbox
                analyticsLabel="read"
                checked={isReadChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isReadChecked && !isUnreadChecked}
                label="Read"
                // labelIcon="mail-read"
                onChange={checked => {
                  setColumnUnreadFilter({
                    columnId: column.id,
                    unread: getUnreadFilterValue(!!checked, isUnreadChecked),
                  })
                }}
              />

              <Spacer height={contentPadding / 2} />

              <SpringAnimatedCheckbox
                analyticsLabel="unread"
                checked={isUnreadChecked}
                containerStyle={{ flexGrow: 1 }}
                disabled={isUnreadChecked && !isReadChecked}
                label="Unread"
                // labelIcon="mail"
                onChange={checked => {
                  setColumnUnreadFilter({
                    columnId: column.id,
                    unread: getUnreadFilterValue(isReadChecked, !!checked),
                  })
                }}
              />
            </ColumnOptionsRow>
          )
        })()}

        {(() => {
          const isPrivateChecked =
            column.type === 'notifications'
              ? column.filters && column.filters.private === true
              : hasPrivateAccess &&
                !(column.filters && column.filters.private === false)

          const isPublicChecked = !(
            column.filters && column.filters.private === true
          )

          const canShowPrivateContent = hasPrivateAccess // || column.type === 'notifications'

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
              isOpen={openedOptionCategories.has('privacy')}
              onToggle={
                allowToggleCategoriesRef.current
                  ? () => toggleOpenedOptionCategory('privacy')
                  : undefined
              }
              subtitle={
                isPrivateChecked && !isPublicChecked
                  ? 'Private'
                  : !isPrivateChecked && isPublicChecked
                  ? 'Public'
                  : 'All'
              }
              title="Privacy"
            >
              <SpringAnimatedCheckbox
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

              <SpringAnimatedCheckbox
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
      </ScrollView>

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
          analyticsLabel={allIsOpen ? 'collapse_filters' : 'expand_filters'}
          enableForegroundHover
          iconName={allIsOpen ? 'fold' : 'unfold'}
          onPress={() => {
            if (allIsOpen) {
              allowOnlyOneCategoryToBeOpenedRef.current = true

              setOpenedOptionCategories(new Set([]))
            } else {
              allowOnlyOneCategoryToBeOpenedRef.current = false

              setOpenedOptionCategories(new Set(allColumnOptionCategories))
            }
          }}
          text={allIsOpen ? 'Collapse filters' : 'Expand filters'}
        />

        <ColumnHeaderItem
          analyticsLabel="remove_column"
          enableForegroundHover
          iconName="trashcan"
          onPress={() => deleteColumn({ columnId: column.id, columnIndex })}
          text="Remove"
        />
      </View>
      <CardItemSeparator />
    </SpringAnimatedView>
  )
})
