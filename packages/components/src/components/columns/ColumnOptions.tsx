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
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderHeight,
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
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
import { useAppLayout } from '../context/LayoutContext'
import { useTheme } from '../context/ThemeContext'
import { getColumnHeaderThemeColors } from './ColumnHeader'
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
  forceOpenAll?: boolean
  fullHeight?: boolean
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
  const {
    availableHeight,
    column,
    columnIndex,
    forceOpenAll,
    fullHeight,
  } = props

  const { startWithFiltersExpanded = availableHeight >= 1000 } = props

  const _allColumnOptionCategories: Array<ColumnOptionCategory | false> = [
    column.type === 'notifications' && 'inbox',
    'saved_for_later',
    'unread',
    column.type === 'activity' && 'event_types',
    column.type === 'notifications' && 'notification_reasons',
    column.type === 'notifications' && 'privacy',
  ]

  const allColumnOptionCategories = _allColumnOptionCategories.filter(
    Boolean,
  ) as ColumnOptionCategory[]

  const [openedOptionCategories, setOpenedOptionCategories] = useState(
    () =>
      new Set<ColumnOptionCategory>(
        forceOpenAll || startWithFiltersExpanded
          ? allColumnOptionCategories
          : [],
      ),
  )

  const allIsOpen =
    openedOptionCategories.size === allColumnOptionCategories.length
  const allowOnlyOneCategoryToBeOpenedRef = useRef(!allIsOpen)
  const allowToggleCategories = !forceOpenAll

  const [containerWidth, setContainerWidth] = useState(0)

  const theme = useTheme()

  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()

  const columnIds = useReduxState(selectors.columnIdsSelector)

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

  const checkboxStyle = {
    flexGrow: 1,
    paddingVertical: contentPadding / 4,
    paddingHorizontal: contentPadding,
  }

  const checkboxSquareStyle = {
    width: columnHeaderItemContentSize,
  }

  return (
    <SpringAnimatedView
      style={{
        alignSelf: 'stretch',
        backgroundColor:
          theme[getColumnHeaderThemeColors(theme.backgroundColor).normal],
        height: fullHeight ? availableHeight : 'auto',
      }}
      onLayout={e => {
        setContainerWidth(e.nativeEvent.layout.width)
      }}
    >
      <ScrollView
        alwaysBounceVertical={false}
        style={{ maxHeight: availableHeight - columnHeaderHeight - 4 }}
      >
        {allColumnOptionCategories.includes('inbox') &&
          column.type === 'notifications' &&
          (() => {
            const participating =
              column.filters &&
              column.filters.notifications &&
              column.filters.notifications.participating

            return (
              <ColumnOptionsRow
                analyticsLabel="inbox"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={!!participating}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="inbox"
                isOpen={openedOptionCategories.has('inbox')}
                onToggle={
                  allowToggleCategories
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
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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

        {allColumnOptionCategories.includes('saved_for_later') &&
          (() => {
            const savedForLater = column.filters && column.filters.saved

            return (
              <ColumnOptionsRow
                analyticsLabel="saved_for_later"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof savedForLater === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="bookmark"
                isOpen={openedOptionCategories.has('saved_for_later')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('saved_for_later')
                    : undefined
                }
                subtitle={
                  savedForLater === true
                    ? 'Saved only'
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
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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

        {allColumnOptionCategories.includes('unread') &&
          (() => {
            const isReadChecked = isReadFilterChecked(column.filters)
            const isUnreadChecked = isUnreadFilterChecked(column.filters)

            function getUnreadFilterValue(read?: boolean, unread?: boolean) {
              return read && unread ? undefined : read ? false : unread
            }

            return (
              <ColumnOptionsRow
                analyticsLabel="read_status"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  !!(
                    column.filters && typeof column.filters.unread === 'boolean'
                  )
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName={
                  column.filters && column.filters.unread === true
                    ? 'mail'
                    : 'mail-read'
                }
                isOpen={openedOptionCategories.has('unread')}
                onToggle={
                  allowToggleCategories
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
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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

                <SpringAnimatedCheckbox
                  analyticsLabel="unread"
                  checked={isUnreadChecked}
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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

        {allColumnOptionCategories.includes('notification_reasons') &&
          column.type === 'notifications' &&
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
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="rss"
                isOpen={openedOptionCategories.has('notification_reasons')}
                onToggle={
                  allowToggleCategories
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
                      checkedForegroundColor={theme.backgroundColorDarker1}
                      containerStyle={checkboxStyle}
                      squareContainerStyle={checkboxSquareStyle}
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

        {allColumnOptionCategories.includes('event_types') &&
          column.type === 'activity' &&
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
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="note"
                isOpen={openedOptionCategories.has('event_types')}
                onToggle={
                  allowToggleCategories
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
                      containerStyle={checkboxStyle}
                      squareContainerStyle={checkboxSquareStyle}
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

        {allColumnOptionCategories.includes('privacy') &&
          (() => {
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
                analyticsLabel="privacy"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  !!column.filters &&
                  typeof column.filters.private === 'boolean'
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName={
                  column.filters && column.filters.private === false
                    ? 'globe'
                    : 'lock'
                }
                isOpen={openedOptionCategories.has('privacy')}
                onToggle={
                  allowToggleCategories
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
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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

                <SpringAnimatedCheckbox
                  analyticsLabel="private"
                  checked={isPrivateChecked}
                  containerStyle={checkboxStyle}
                  squareContainerStyle={checkboxSquareStyle}
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
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: contentPadding / 2,
        }}
      >
        <ColumnHeaderItem
          key="column-options-button-move-column-left"
          analyticsLabel="move_column_left"
          disabled={columnIndex === 0}
          enableForegroundHover
          iconName={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? 'chevron-up'
              : 'chevron-left'
          }
          onPress={() =>
            moveColumn({
              columnId: column.id,
              columnIndex: columnIndex - 1,
            })
          }
        />

        <ColumnHeaderItem
          key="column-options-button-move-column-right"
          analyticsLabel="move_column_right"
          disabled={columnIndex === columnIds.length - 1}
          enableForegroundHover
          iconName={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? 'chevron-down'
              : 'chevron-right'
          }
          onPress={() =>
            moveColumn({
              columnId: column.id,
              columnIndex: columnIndex + 1,
            })
          }
        />

        <Spacer flex={1} />

        {!forceOpenAll && !!allowToggleCategories && (
          <ColumnHeaderItem
            key="column-options-button-toggle-collapse-filters"
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
            text={
              containerWidth > 300
                ? allIsOpen
                  ? 'Collapse filters'
                  : 'Expand filters'
                : ''
            }
          />
        )}

        <ColumnHeaderItem
          key="column-options-button-remove-column"
          analyticsLabel="remove_column"
          enableForegroundHover
          iconName="trashcan"
          onPress={() => deleteColumn({ columnId: column.id, columnIndex })}
          text={containerWidth > 300 ? 'Remove' : ''}
        />
      </View>
      <CardItemSeparator />
    </SpringAnimatedView>
  )
})
