import _ from 'lodash'
import React, { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'

import {
  Column,
  eventActions,
  eventSubjectTypes,
  filterRecordHasAnyForcedValue,
  filterRecordWithThisValueCount,
  getEventActionMetadata,
  getFilterCountMetadata,
  getNotificationReasonMetadata,
  GitHubEventSubjectType,
  GitHubIssueOrPullRequestSubjectType,
  GitHubNotificationSubjectType,
  GitHubStateType,
  isReadFilterChecked,
  issueOrPullRequestSubjectTypes,
  isUnreadFilterChecked,
  itemPassesFilterRecord,
  notificationReasons,
  notificationSubjectTypes,
  ThemeColors,
} from '@devhub/core'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import {
  columnHeaderHeight,
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import {
  getStateTypeMetadata,
  getSubjectTypeMetadata,
  issueOrPullRequestStateTypes,
} from '../../utils/helpers/github/shared'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
import { Checkbox } from '../common/Checkbox'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedView } from '../themed/ThemedView'
import { getColumnHeaderThemeColors } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptionsRow } from './ColumnOptionsRow'

const metadataSortFn = (a: { label: string }, b: { label: string }) =>
  a.label < b.label ? -1 : a.label > b.label ? 1 : 0

const stateTypeOptions = issueOrPullRequestStateTypes.map(getStateTypeMetadata)

const eventSubjectTypeOptions = eventSubjectTypes
  .map(getSubjectTypeMetadata)
  .sort(metadataSortFn)

const eventActionOptions = eventActions
  .map(getEventActionMetadata)
  .sort(metadataSortFn)

const issueOrPullRequestSubjectTypeOptions = issueOrPullRequestSubjectTypes
  .map(getSubjectTypeMetadata)
  .sort(metadataSortFn)

const notificationSubjectTypeOptions = notificationSubjectTypes
  .map(getSubjectTypeMetadata)
  .sort(metadataSortFn)

const notificationReasonOptions = notificationReasons
  .map(getNotificationReasonMetadata)
  .sort(metadataSortFn)

export interface ColumnOptionsProps {
  availableHeight: number
  column: Column
  columnIndex: number
  forceOpenAll?: boolean
  fullHeight?: boolean
  startWithFiltersExpanded?: boolean
}

export type ColumnOptionCategory =
  | 'event_action'
  | 'inbox'
  | 'notification_reason'
  | 'privacy'
  | 'saved_for_later'
  | 'state'
  | 'draft'
  | 'subject_types'
  | 'unread'

export const ColumnOptions = React.memo((props: ColumnOptionsProps) => {
  const {
    availableHeight,
    column,
    columnIndex,
    forceOpenAll,
    fullHeight,
    startWithFiltersExpanded,
  } = props

  const _allColumnOptionCategories: Array<ColumnOptionCategory | false> = [
    column.type === 'notifications' && 'inbox',
    'saved_for_later',
    'unread',
    'state',
    'draft',
    'subject_types',
    column.type === 'activity' && 'event_action',
    column.type === 'notifications' && 'notification_reason',
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

  // const [containerWidth, setContainerWidth] = useState(0)

  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()

  const columnIds = useReduxState(selectors.columnIdsSelector)

  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
  const setColumnSavedFilter = useReduxAction(actions.setColumnSavedFilter)
  const setColumnParticipatingFilter = useReduxAction(
    actions.setColumnParticipatingFilter,
  )
  const setColumnActivityActionFilter = useReduxAction(
    actions.setColumnActivityActionFilter,
  )
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColummStateTypeFilter = useReduxAction(
    actions.setColummStateTypeFilter,
  )
  const setColummDraftFilter = useReduxAction(actions.setColummDraftFilter)
  const setColummSubjectTypeFilter = useReduxAction(
    actions.setColummSubjectTypeFilter,
  )
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
    paddingVertical: contentPadding / 4,
    paddingHorizontal: contentPadding,
  }

  const checkboxSquareStyle = {
    width: columnHeaderItemContentSize,
  }

  return (
    <ThemedView
      backgroundColor={theme =>
        theme[getColumnHeaderThemeColors(theme.backgroundColor).normal]
      }
      style={{
        alignSelf: 'stretch',
        height: fullHeight ? availableHeight : 'auto',
      }}
      // onLayout={e => {
      //   setContainerWidth(e.nativeEvent.layout.width)
      // }}
    >
      <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical
        bounces
        showsHorizontalScrollIndicator={false}
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
                <Checkbox
                  analyticsLabel="all_notifications"
                  checked={!participating}
                  circle
                  containerStyle={checkboxStyle}
                  defaultValue={false}
                  squareContainerStyle={checkboxSquareStyle}
                  label="All"
                  onChange={checked => {
                    setColumnParticipatingFilter({
                      columnId: column.id,
                      participating: false,
                    })
                  }}
                />
                <Checkbox
                  analyticsLabel="participating_notifications"
                  checked={participating}
                  circle
                  containerStyle={checkboxStyle}
                  defaultValue={false}
                  squareContainerStyle={checkboxSquareStyle}
                  label="Participating"
                  onChange={checked => {
                    setColumnParticipatingFilter({
                      columnId: column.id,
                      participating: true,
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
                <Checkbox
                  analyticsLabel="save_for_later"
                  checked={
                    typeof savedForLater === 'boolean' ? savedForLater : null
                  }
                  containerStyle={checkboxStyle}
                  defaultValue
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
                <Checkbox
                  analyticsLabel="read"
                  checked={
                    isReadChecked && isUnreadChecked ? null : isReadChecked
                  }
                  containerStyle={checkboxStyle}
                  defaultValue
                  enableIndeterminateState={isReadChecked && isUnreadChecked}
                  label="Read"
                  // labelIcon="mail-read"
                  squareContainerStyle={checkboxSquareStyle}
                  onChange={checked => {
                    setColumnUnreadFilter({
                      columnId: column.id,
                      unread:
                        isReadChecked && isUnreadChecked
                          ? false
                          : isReadChecked
                          ? undefined
                          : isUnreadChecked
                          ? undefined
                          : false,
                    })
                  }}
                />

                <Checkbox
                  analyticsLabel="unread"
                  checked={
                    isReadChecked && isUnreadChecked ? null : isUnreadChecked
                  }
                  containerStyle={checkboxStyle}
                  defaultValue
                  enableIndeterminateState={isReadChecked && isUnreadChecked}
                  label="Unread"
                  // labelIcon="mail"
                  squareContainerStyle={checkboxSquareStyle}
                  onChange={checked => {
                    setColumnUnreadFilter({
                      columnId: column.id,
                      unread:
                        isReadChecked && isUnreadChecked
                          ? true
                          : isUnreadChecked
                          ? undefined
                          : isReadChecked
                          ? undefined
                          : true,
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('state') &&
          (() => {
            const filters =
              column.filters &&
              (column.filters.state as Partial<
                Record<GitHubStateType, boolean>
              >)

            const defaultBooleanValue = true
            const isFilterStrict = filterRecordWithThisValueCount(
              filters,
              defaultBooleanValue,
            )
            const hasForcedValue = filterRecordHasAnyForcedValue(filters)
            const countMetadata = getFilterCountMetadata(
              filters,
              stateTypeOptions.length,
              defaultBooleanValue,
            )

            const supportsOnlyOne = column.type === 'issue_or_pr'

            return (
              <ColumnOptionsRow
                analyticsLabel="state_options_row"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName={
                  hasForcedValue
                    ? itemPassesFilterRecord(
                        filters!,
                        'merged',
                        defaultBooleanValue,
                      )
                      ? 'git-merge'
                      : itemPassesFilterRecord(
                          filters!,
                          'closed',
                          defaultBooleanValue,
                        )
                      ? 'issue-closed'
                      : 'issue-opened'
                    : 'issue-opened'
                }
                isOpen={openedOptionCategories.has('state')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('state')
                    : undefined
                }
                title="State"
                subtitle={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : 'All'
                }
              >
                {stateTypeOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.state] === 'boolean'
                      ? filters[item.state]
                      : isFilterStrict
                      ? !defaultBooleanValue
                      : null

                  const enableIndeterminateState =
                    !isFilterStrict || checked === defaultBooleanValue

                  return (
                    <Checkbox
                      key={`state-type-option-${item.state}`}
                      analyticsLabel={undefined}
                      checked={checked}
                      checkedBackgroundThemeColor={item.color}
                      circle={supportsOnlyOne}
                      containerStyle={checkboxStyle}
                      defaultValue={defaultBooleanValue}
                      squareContainerStyle={checkboxSquareStyle}
                      enableIndeterminateState={enableIndeterminateState}
                      label={item.label}
                      onChange={value => {
                        setColummStateTypeFilter({
                          columnId: column.id,
                          state: item.state,
                          supportsOnlyOne,
                          value: supportsOnlyOne
                            ? typeof value === 'boolean'
                              ? true
                              : null
                            : isFilterStrict
                            ? typeof value === 'boolean'
                              ? defaultBooleanValue
                              : null
                            : hasForcedValue
                            ? typeof value === 'boolean'
                              ? !defaultBooleanValue
                              : null
                            : value,
                        })
                      }}
                      uncheckedForegroundThemeColor={item.color}
                    />
                  )
                })}
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('draft') &&
          (() => {
            const draft = column.filters && column.filters.draft
            const defaultBooleanValue = true

            return (
              <ColumnOptionsRow
                analyticsLabel="draft_options_row"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof draft === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="pencil"
                isOpen={openedOptionCategories.has('draft')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('draft')
                    : undefined
                }
                title="Draft"
                subtitle={
                  draft === true
                    ? 'Draft only'
                    : draft === false
                    ? 'Excluded'
                    : 'Included'
                }
              >
                <Checkbox
                  key="draft-type-option"
                  analyticsLabel={undefined}
                  checked={typeof draft === 'boolean' ? draft : null}
                  checkedBackgroundThemeColor="gray"
                  containerStyle={checkboxStyle}
                  defaultValue={defaultBooleanValue}
                  squareContainerStyle={checkboxSquareStyle}
                  enableIndeterminateState
                  label="Draft"
                  onChange={value => {
                    setColummDraftFilter({
                      columnId: column.id,
                      draft: typeof value === 'boolean' ? value : undefined,
                    })
                  }}
                  uncheckedForegroundThemeColor="gray"
                />
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('subject_types') &&
          (() => {
            const filters =
              column.filters &&
              (column.filters.subjectTypes as Partial<
                Record<
                  | GitHubEventSubjectType
                  | GitHubIssueOrPullRequestSubjectType
                  | GitHubNotificationSubjectType,
                  boolean
                >
              >)

            const subjectTypeOptions: Array<{
              color?: keyof ThemeColors | undefined
              label: string
              subjectType:
                | GitHubEventSubjectType
                | GitHubIssueOrPullRequestSubjectType
                | GitHubNotificationSubjectType
            }> =
              column.type === 'activity'
                ? eventSubjectTypeOptions
                : column.type === 'issue_or_pr'
                ? issueOrPullRequestSubjectTypeOptions
                : column.type === 'notifications'
                ? notificationSubjectTypeOptions
                : []

            if (!(subjectTypeOptions && subjectTypeOptions.length)) return null

            const defaultBooleanValue = true
            const isFilterStrict = filterRecordWithThisValueCount(
              filters,
              defaultBooleanValue,
            )
            const hasForcedValue = filterRecordHasAnyForcedValue(filters)
            const countMetadata = getFilterCountMetadata(
              filters,
              subjectTypeOptions.length,
              defaultBooleanValue,
            )

            return (
              <ColumnOptionsRow
                analyticsLabel="subject_types"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="file"
                isOpen={openedOptionCategories.has('subject_types')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('subject_types')
                    : undefined
                }
                title="Subject type"
                subtitle={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : 'All'
                }
              >
                {subjectTypeOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.subjectType] === 'boolean'
                      ? filters[item.subjectType]
                      : isFilterStrict
                      ? !defaultBooleanValue
                      : null

                  const enableIndeterminateState =
                    !isFilterStrict || checked === defaultBooleanValue

                  return (
                    <Checkbox
                      key={`notification-subject-type-option-${
                        item.subjectType
                      }`}
                      analyticsLabel={undefined}
                      checked={checked}
                      checkedBackgroundThemeColor={item.color}
                      containerStyle={checkboxStyle}
                      defaultValue={defaultBooleanValue}
                      enableIndeterminateState={enableIndeterminateState}
                      label={item.label}
                      onChange={value => {
                        setColummSubjectTypeFilter({
                          columnId: column.id,
                          subjectType: item.subjectType,
                          value: isFilterStrict
                            ? typeof value === 'boolean'
                              ? defaultBooleanValue
                              : null
                            : hasForcedValue
                            ? typeof value === 'boolean'
                              ? !defaultBooleanValue
                              : null
                            : value,
                        })
                      }}
                      squareContainerStyle={checkboxSquareStyle}
                      uncheckedForegroundThemeColor={item.color}
                    />
                  )
                })}
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('notification_reason') &&
          column.type === 'notifications' &&
          (() => {
            const filters =
              column.filters &&
              column.filters.notifications &&
              column.filters.notifications.reasons

            const defaultBooleanValue = true
            const isFilterStrict = filterRecordWithThisValueCount(
              filters,
              defaultBooleanValue,
            )
            const hasForcedValue = filterRecordHasAnyForcedValue(filters)
            const countMetadata = getFilterCountMetadata(
              filters,
              notificationReasonOptions.length,
              defaultBooleanValue,
            )

            return (
              <ColumnOptionsRow
                analyticsLabel="notification_reason"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="rss"
                isOpen={openedOptionCategories.has('notification_reason')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('notification_reason')
                    : undefined
                }
                title="Subscription reason"
                subtitle={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : 'All'
                }
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
                      checkedBackgroundThemeColor={item.color}
                      containerStyle={checkboxStyle}
                      defaultValue={defaultBooleanValue}
                      enableIndeterminateState={
                        !isFilterStrict || checked === defaultBooleanValue
                      }
                      label={item.label}
                      labelTooltip={item.fullDescription}
                      onChange={value => {
                        setColumnReasonFilter({
                          columnId: column.id,
                          reason: item.reason,
                          value: isFilterStrict
                            ? typeof value === 'boolean'
                              ? defaultBooleanValue
                              : null
                            : hasForcedValue
                            ? typeof value === 'boolean'
                              ? !defaultBooleanValue
                              : null
                            : value,
                        })
                      }}
                      squareContainerStyle={checkboxSquareStyle}
                      uncheckedForegroundThemeColor={item.color}
                    />
                  )
                })}
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('event_action') &&
          column.type === 'activity' &&
          (() => {
            const filters =
              column.filters &&
              column.filters.activity &&
              column.filters.activity.actions

            const defaultBooleanValue = true
            const isFilterStrict = filterRecordWithThisValueCount(
              filters,
              defaultBooleanValue,
            )
            const hasForcedValue = filterRecordHasAnyForcedValue(filters)
            const countMetadata = getFilterCountMetadata(
              filters,
              eventActionOptions.length,
              defaultBooleanValue,
            )

            return (
              <ColumnOptionsRow
                analyticsLabel="event_action"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="note"
                isOpen={openedOptionCategories.has('event_action')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('event_action')
                    : undefined
                }
                title="Event action"
                subtitle={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : 'All'
                }
              >
                {eventActionOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.action] === 'boolean'
                      ? filters[item.action]
                      : isFilterStrict
                      ? !defaultBooleanValue
                      : null

                  const enableIndeterminateState =
                    !isFilterStrict || checked === defaultBooleanValue

                  return (
                    <Checkbox
                      key={`event-type-option-${item.action}`}
                      analyticsLabel={undefined}
                      checked={checked}
                      containerStyle={checkboxStyle}
                      defaultValue={defaultBooleanValue}
                      enableIndeterminateState={enableIndeterminateState}
                      label={item.label}
                      // labelIcon={item.icon}
                      onChange={value => {
                        setColumnActivityActionFilter({
                          columnId: column.id,
                          type: item.action,
                          value: isFilterStrict
                            ? typeof value === 'boolean'
                              ? defaultBooleanValue
                              : null
                            : hasForcedValue
                            ? typeof value === 'boolean'
                              ? !defaultBooleanValue
                              : null
                            : value,
                        })
                      }}
                      squareContainerStyle={checkboxSquareStyle}
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
                <Checkbox
                  analyticsLabel="public"
                  checked={
                    isPublicChecked && isPrivateChecked ? null : isPublicChecked
                  }
                  containerStyle={checkboxStyle}
                  defaultValue
                  enableIndeterminateState={isPublicChecked && isPrivateChecked}
                  label="Public"
                  // labelIcon="globe"
                  squareContainerStyle={checkboxSquareStyle}
                  onChange={checked => {
                    setColumnPrivacyFilter({
                      columnId: column.id,
                      private:
                        isPublicChecked && isPrivateChecked
                          ? false
                          : isPublicChecked
                          ? undefined
                          : isPrivateChecked
                          ? undefined
                          : false,
                    })
                  }}
                />

                <Checkbox
                  analyticsLabel="private"
                  checked={
                    isPublicChecked && isPrivateChecked
                      ? null
                      : isPrivateChecked
                  }
                  containerStyle={checkboxStyle}
                  defaultValue
                  enableIndeterminateState={isPublicChecked && isPrivateChecked}
                  label="Private"
                  // labelIcon="lock"
                  squareContainerStyle={checkboxSquareStyle}
                  onChange={checked => {
                    setColumnPrivacyFilter({
                      columnId: column.id,
                      private:
                        isPublicChecked && isPrivateChecked
                          ? true
                          : isPrivateChecked
                          ? undefined
                          : isPublicChecked
                          ? undefined
                          : true,
                    })
                  }}
                />
              </ColumnOptionsRow>
            )
          })()}
      </ScrollView>

      <Separator horizontal />

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: contentPadding / 2,
        }}
      >
        <ColumnHeaderItem
          key="column-options-button-move-column-left"
          analyticsLabel="move_column_left"
          enableForegroundHover
          disabled={columnIndex === 0 && Platform.realOS === 'web'}
          fixedIconSize
          iconName={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? 'chevron-up'
              : 'chevron-left'
          }
          onPress={() =>
            moveColumn({
              animated: appViewMode === 'multi-column',
              columnId: column.id,
              columnIndex: columnIndex - 1,
              highlight: appViewMode === 'multi-column' || columnIndex === 0,
              scrollTo: true,
            })
          }
          style={{ opacity: columnIndex === 0 ? 0.5 : 1 }}
          tooltip={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? `Move column up (${
                  keyboardShortcutsById.moveColumnLeft.keys[0]
                })`
              : `Move column left (${
                  keyboardShortcutsById.moveColumnLeft.keys[0]
                })`
          }
        />

        <ColumnHeaderItem
          key="column-options-button-move-column-right"
          analyticsLabel="move_column_right"
          enableForegroundHover
          disabled={
            columnIndex === columnIds.length - 1 && Platform.realOS === 'web'
          }
          fixedIconSize
          iconName={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? 'chevron-down'
              : 'chevron-right'
          }
          onPress={() =>
            moveColumn({
              animated: appViewMode === 'multi-column',
              columnId: column.id,
              columnIndex: columnIndex + 1,
              highlight:
                appViewMode === 'multi-column' ||
                columnIndex === columnIds.length - 1,
              scrollTo: true,
            })
          }
          style={{ opacity: columnIndex === columnIds.length - 1 ? 0.5 : 1 }}
          tooltip={
            appOrientation === 'landscape' && appViewMode === 'single-column'
              ? `Move column down (${
                  keyboardShortcutsById.moveColumnRight.keys[0]
                })`
              : `Move column right (${
                  keyboardShortcutsById.moveColumnRight.keys[0]
                })`
          }
        />

        <Spacer flex={1} />

        {!forceOpenAll && !!allowToggleCategories && (
          <ColumnHeaderItem
            key="column-options-button-toggle-collapse-filters"
            analyticsLabel={allIsOpen ? 'collapse_filters' : 'expand_filters'}
            enableForegroundHover
            fixedIconSize
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
            text=""
            // text={
            //   containerWidth > 300
            //     ? allIsOpen
            //       ? 'Collapse filters'
            //       : 'Expand filters'
            //     : ''
            // }
            tooltip={allIsOpen ? 'Collapse filters' : 'Expand filters'}
          />
        )}

        <ColumnHeaderItem
          key="column-options-button-remove-column"
          analyticsLabel="remove_column"
          enableForegroundHover
          fixedIconSize
          iconName="trashcan"
          onPress={() => deleteColumn({ columnId: column.id, columnIndex })}
          // text={containerWidth > 300 ? 'Remove' : ''}
          text=""
          tooltip="Remove column"
        />
      </View>

      <CardItemSeparator isRead />
    </ThemedView>
  )
})
