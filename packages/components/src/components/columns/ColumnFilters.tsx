import _ from 'lodash'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'

import {
  columnHasAnyFilter,
  eventActions,
  eventSubjectTypes,
  filterRecordHasAnyForcedValue,
  filterRecordWithThisValueCount,
  getEventActionMetadata,
  getFilterCountMetadata,
  getFilteredItems,
  getItemInbox,
  getItemsFilterMetadata,
  getNotificationReasonMetadata,
  getOwnerAndRepoFormattedFilter,
  getStateTypeMetadata,
  getSubjectTypeMetadata,
  GitHubEventSubjectType,
  GitHubIssueOrPullRequestSubjectType,
  GitHubNotificationSubjectType,
  GitHubStateType,
  isReadFilterChecked,
  IssueOrPullRequestColumnFilters,
  issueOrPullRequestStateTypes,
  issueOrPullRequestSubjectTypes,
  isUnreadFilterChecked,
  itemPassesFilterRecord,
  notificationReasons,
  notificationSubjectTypes,
  ThemeColors,
} from '@devhub/core'
import { useColumn } from '../../hooks/use-column'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxAction } from '../../hooks/use-redux-action'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import { sharedStyles } from '../../styles/shared'
import { contentPadding } from '../../styles/variables'
import { columnHeaderItemContentSize } from '../columns/ColumnHeader'
import { Avatar } from '../common/Avatar'
import { Button } from '../common/Button'
import {
  Checkbox,
  checkboxLabelSpacing,
  defaultCheckboxSize,
} from '../common/Checkbox'
import {
  CounterMetadata,
  CounterMetadataProps,
} from '../common/CounterMetadata'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { getColumnHeaderThemeColors } from './ColumnHeader'
import { ColumnOptionsInbox } from './ColumnOptionsInbox'
import { ColumnOptionsRow } from './ColumnOptionsRow'
import { sharedColumnOptionsStyles } from './options/shared'

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

export interface ColumnFiltersProps {
  columnId: string
  forceOpenAll?: boolean
  startWithFiltersExpanded?: boolean
}

export type ColumnFilterCategory =
  | 'bot'
  | 'draft'
  | 'event_action'
  | 'inbox'
  | 'involves'
  | 'notification_reason'
  | 'privacy'
  | 'repos'
  | 'saved_for_later'
  | 'state'
  | 'subject_types'
  | 'unread'

const getFilteredItemsOptions: Parameters<typeof getFilteredItems>[3] = {
  mergeSimilar: false,
}

export const ColumnFilters = React.memo((props: ColumnFiltersProps) => {
  const { columnId, forceOpenAll, startWithFiltersExpanded } = props

  const { column } = useColumn(columnId)

  const { allItems, filteredItems } = useColumnData(
    columnId,
    getFilteredItemsOptions,
  )

  const {
    allForcedOwners,
    allForcedRepos,
    ownerFilters,
    ownerFiltersWithRepos,
    repoFilters,
  } = useMemo(() => getOwnerAndRepoFormattedFilter(column && column.filters), [
    column && column.filters,
  ])

  const ownerOrRepoFilteredItemsMetadata = useMemo(
    () =>
      column &&
      getItemsFilterMetadata(
        column.type,
        getFilteredItems(
          column.type,
          allItems,
          {
            ...column.filters,
            owners: undefined,
          },
          getFilteredItemsOptions,
        ),
        {
          forceIncludeTheseOwners: allForcedOwners,
          forceIncludeTheseRepos: allForcedRepos,
        },
      ),
    [
      column && column.type,
      allItems,
      column && column.filters,
      allForcedOwners,
      allForcedRepos,
    ],
  )

  const _owners = Object.keys(
    (ownerOrRepoFilteredItemsMetadata &&
      ownerOrRepoFilteredItemsMetadata.owners) ||
      {},
  )
  const _shouldShowOwnerOrRepoFilters = !!(
    _owners.length >= 1 ||
    (_owners.length === 1 &&
      ownerOrRepoFilteredItemsMetadata &&
      ownerOrRepoFilteredItemsMetadata.owners[_owners[0]].repos &&
      Object.keys(ownerOrRepoFilteredItemsMetadata.owners[_owners[0]].repos)
        .length >= 1)
  )

  const involvingUsers = useMemo(
    () =>
      _.sortBy(
        Object.keys(
          (column &&
            column.filters &&
            (column.filters as IssueOrPullRequestColumnFilters).involves) ||
            {},
        ),
      ),
    [
      column &&
        column.filters &&
        (column.filters as IssueOrPullRequestColumnFilters).involves,
    ],
  )

  const _shouldShowInvolvesFilter = !!(
    column &&
    column.type === 'issue_or_pr' &&
    !!involvingUsers &&
    involvingUsers.length >= 1
  )

  const _allColumnOptionCategories: Array<ColumnFilterCategory | false> = [
    !!column && column.type === 'notifications' && 'inbox',
    'saved_for_later',
    'unread',
    'state',
    'draft',
    'bot',
    _shouldShowInvolvesFilter && 'involves',
    'subject_types',
    !!column && column.type === 'activity' && 'event_action',
    !!column && column.type === 'notifications' && 'notification_reason',
    !!column && column.type === 'notifications' && 'privacy',
    _shouldShowOwnerOrRepoFilters && 'repos',
  ]

  const allColumnOptionCategories = _allColumnOptionCategories.filter(
    Boolean,
  ) as ColumnFilterCategory[]

  const [openedOptionCategories, setOpenedOptionCategories] = useState(
    () =>
      new Set<ColumnFilterCategory>(
        forceOpenAll || startWithFiltersExpanded
          ? allColumnOptionCategories
          : [],
      ),
  )
  const lastColumnCategory = allColumnOptionCategories.slice(-1)[0]

  const allIsOpen =
    openedOptionCategories.size === allColumnOptionCategories.length
  const allowOnlyOneCategoryToBeOpenedRef = useRef(!allIsOpen)
  const allowToggleCategories = !forceOpenAll

  const clearColumnFilters = useReduxAction(actions.clearColumnFilters)
  const setColumnSavedFilter = useReduxAction(actions.setColumnSavedFilter)
  const setColumnParticipatingFilter = useReduxAction(
    actions.setColumnParticipatingFilter,
  )
  const setColumnActivityActionFilter = useReduxAction(
    actions.setColumnActivityActionFilter,
  )
  // const setColumnInvolvesFilter = useReduxAction(
  //   actions.setColumnInvolvesFilter,
  // )
  const setColumnOwnerFilter = useReduxAction(actions.setColumnOwnerFilter)
  const setColumnRepoFilter = useReduxAction(actions.setColumnRepoFilter)
  const setColumnPrivacyFilter = useReduxAction(actions.setColumnPrivacyFilter)
  const setColumnReasonFilter = useReduxAction(actions.setColumnReasonFilter)
  const setColummStateTypeFilter = useReduxAction(
    actions.setColummStateTypeFilter,
  )
  const setColummBotFilter = useReduxAction(actions.setColummBotFilter)
  const setColummDraftFilter = useReduxAction(actions.setColummDraftFilter)
  const setColummSubjectTypeFilter = useReduxAction(
    actions.setColummSubjectTypeFilter,
  )
  const setColumnUnreadFilter = useReduxAction(actions.setColumnUnreadFilter)

  const toggleOpenedOptionCategory = useCallback(
    (optionCategory: ColumnFilterCategory) => {
      setOpenedOptionCategories(_set => {
        const set = new Set(_set)
        const isOpen = set.has(optionCategory)
        if (allowOnlyOneCategoryToBeOpenedRef.current) set.clear()
        isOpen ? set.delete(optionCategory) : set.add(optionCategory)

        if (set.size === 0) allowOnlyOneCategoryToBeOpenedRef.current = true

        return set
      })
    },
    [],
  )

  const allItemsMetadata = useMemo(
    () => getItemsFilterMetadata(column ? column.type : 'activity', allItems),
    [column && column.type, allItems],
  )

  const filteredItemsMetadata = useMemo(
    () =>
      getItemsFilterMetadata(column ? column.type : 'activity', filteredItems),
    [column && column.type, filteredItems],
  )

  if (!column) return null

  const inbox = getItemInbox(column.type, column.filters)

  function getCheckboxRight(
    counterMetadataProps: Pick<
      CounterMetadataProps,
      'read' | 'total' | 'unread'
    >,
    {
      alwaysRenderANumber,
      backgroundColor,
    }: {
      alwaysRenderANumber?: boolean
      backgroundColor?: keyof ThemeColors
    } = {},
  ) {
    return (
      <CounterMetadata
        {...counterMetadataProps}
        alwaysRenderANumber={alwaysRenderANumber}
        backgroundColor={backgroundColor}
      />
    )
  }

  return (
    <ThemedView
      backgroundColor={getColumnHeaderThemeColors().normal}
      style={sharedStyles.flex}
    >
      <ScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical
        bounces
        showsHorizontalScrollIndicator={false}
        style={sharedStyles.flex}
      >
        {allColumnOptionCategories.includes('inbox') &&
          column.type === 'notifications' && (
            <ColumnOptionsInbox
              enableBackgroundHover={allowToggleCategories}
              getCheckboxPropsFor={i => ({
                containerStyle:
                  sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding,
                right:
                  inbox === i
                    ? i === 'all'
                      ? getCheckboxRight(allItemsMetadata.inbox.all)
                      : i === 'participating'
                      ? getCheckboxRight(allItemsMetadata.inbox.participating)
                      : undefined
                    : undefined,
              })}
              inbox={inbox}
              isOpen={openedOptionCategories.has('inbox')}
              onChange={i => {
                setColumnParticipatingFilter({
                  columnId: column.id,
                  participating: i === 'participating',
                })
              }}
              onToggleRowVisibility={
                allowToggleCategories
                  ? () => toggleOpenedOptionCategory('inbox')
                  : undefined
              }
            />
          )}

        {allColumnOptionCategories.includes('involves') &&
          column.type === 'issue_or_pr' &&
          (() => {
            const filters = column.filters && column.filters.involves

            // const defaultBooleanValue = true

            // const isFilterStrict =
            //   filterRecordWithThisValueCount(filters, true) >= 1
            // const filterHasForcedValue = filterRecordHasAnyForcedValue(filters)

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={false}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'involves'}
                iconName="person"
                isOpen={openedOptionCategories.has('involves')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('involves')
                    : undefined
                }
                title="Involves user"
              >
                {involvingUsers.map(user => {
                  const checked =
                    filters && typeof filters[user] === 'boolean'
                      ? filters[user]
                      : null

                  return (
                    <View
                      key={`involves-user-${user}`}
                      style={[
                        sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding,
                        sharedStyles.horizontal,
                      ]}
                    >
                      <Avatar
                        shape="circle"
                        size={defaultCheckboxSize}
                        username={user}
                      />

                      <Spacer width={checkboxLabelSpacing} />

                      <ThemedText
                        color="foregroundColor"
                        numberOfLines={1}
                        style={[
                          sharedStyles.flex,
                          {
                            lineHeight: defaultCheckboxSize,
                          },
                        ]}
                        {...!!user &&
                          Platform.select({
                            web: { title: user },
                          })}
                      >
                        {`${checked === false ? 'not ' : ''}${user || ''}`}
                      </ThemedText>
                    </View>
                  )

                  // return (
                  //   <Checkbox
                  //     key={`involves-user-option-${user}`}
                  //     checked={checked}
                  //     containerStyle={
                  //       sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  //     }
                  //     defaultValue={defaultBooleanValue}
                  //     disabled // to prevent ?q= (empty query) or other invalid search value
                  //     enableIndeterminateState={
                  //       false
                  //       // !isFilterStrict || checked === defaultBooleanValue
                  //     }
                  //     label={user}
                  //     labelTooltip={user}
                  //     left={
                  //       <Avatar
                  //         size={defaultCheckboxSize}
                  //         shape="circle"
                  //         username={user}
                  //       />
                  //     }
                  //     onChange={value => {
                  //       setColumnInvolvesFilter({
                  //         columnId: column.id,
                  //         user,
                  //         value: isFilterStrict
                  //           ? typeof value === 'boolean'
                  //             ? defaultBooleanValue
                  //             : null
                  //           : filterHasForcedValue
                  //           ? typeof value === 'boolean'
                  //             ? !defaultBooleanValue
                  //             : null
                  //           : value,
                  //       })
                  //     }}
                  //     squareContainerStyle={
                  //       sharedColumnOptionsStyles.checkboxSquareContainer
                  //     }
                  //   />
                  // )
                })}
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('saved_for_later') &&
          (() => {
            const savedForLater = column.filters && column.filters.saved

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, saved: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof savedForLater === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'saved_for_later'}
                iconName="bookmark"
                isOpen={openedOptionCategories.has('saved_for_later')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('saved_for_later')
                    : undefined
                }
                right={
                  savedForLater === true
                    ? 'Only'
                    : savedForLater === false
                    ? 'Excluded'
                    : ''
                }
                title="Bookmarked"
              >
                <Checkbox
                  checked={
                    typeof savedForLater === 'boolean' ? savedForLater : null
                  }
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  enableIndeterminateState
                  label="Bookmarked"
                  onChange={checked => {
                    setColumnSavedFilter({
                      columnId: column.id,
                      saved: checked,
                    })
                  }}
                  right={getCheckboxRight(filteredItemsMetadata.saved)}
                />
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('unread') &&
          (() => {
            const isReadChecked = isReadFilterChecked(column.filters)
            const isUnreadChecked = isUnreadFilterChecked(column.filters)

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, unread: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  !!(
                    column.filters && typeof column.filters.unread === 'boolean'
                  )
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'unread'}
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
                right={
                  isReadChecked && !isUnreadChecked
                    ? 'Read'
                    : !isReadChecked && isUnreadChecked
                    ? 'Unread'
                    : ''
                }
                title="Read status"
              >
                <Checkbox
                  checked={
                    isReadChecked && isUnreadChecked ? null : isReadChecked
                  }
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue
                  enableIndeterminateState={isReadChecked && isUnreadChecked}
                  label="Read"
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  onChange={() => {
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
                  right={getCheckboxRight({
                    read: filteredItemsMetadata.inbox[inbox].read,
                  })}
                />

                <Checkbox
                  checked={
                    isReadChecked && isUnreadChecked ? null : isUnreadChecked
                  }
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue
                  enableIndeterminateState={isReadChecked && isUnreadChecked}
                  label="Unread"
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  onChange={() => {
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
                  right={getCheckboxRight({
                    unread: filteredItemsMetadata.inbox[inbox].unread,
                  })}
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

            const supportsOnlyOne = true // column.type === 'issue_or_pr'

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, state: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'state'}
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
                right={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : ''
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
                      checked={checked}
                      checkedBackgroundThemeColor={item.color}
                      circle={supportsOnlyOne}
                      containerStyle={
                        sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                      }
                      defaultValue={defaultBooleanValue}
                      squareContainerStyle={
                        sharedColumnOptionsStyles.checkboxSquareContainer
                      }
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
                      right={getCheckboxRight(
                        filteredItemsMetadata.state[item.state],
                      )}
                      // uncheckedForegroundThemeColor={item.color}
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

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, draft: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof draft === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'draft'}
                iconName="pencil"
                isOpen={openedOptionCategories.has('draft')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('draft')
                    : undefined
                }
                title="Draft"
                right={
                  draft === true ? 'Only' : draft === false ? 'Excluded' : ''
                }
              >
                <Checkbox
                  key="draft-type-option"
                  checked={typeof draft === 'boolean' ? draft : null}
                  checkedBackgroundThemeColor="gray"
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue={defaultBooleanValue}
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  enableIndeterminateState
                  label="Draft"
                  onChange={value => {
                    setColummDraftFilter({
                      columnId: column.id,
                      draft: typeof value === 'boolean' ? value : undefined,
                    })
                  }}
                  right={getCheckboxRight(filteredItemsMetadata.draft)}
                  // uncheckedForegroundThemeColor="gray"
                />
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('bot') &&
          (() => {
            const bot = column.filters && column.filters.bot
            const defaultBooleanValue = true

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, bot: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof bot === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'bot'}
                iconName="hubot"
                isOpen={openedOptionCategories.has('bot')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('bot')
                    : undefined
                }
                title="Bots"
                right={bot === true ? 'Only' : bot === false ? 'Excluded' : ''}
              >
                <Checkbox
                  key="bot-type-option"
                  checked={typeof bot === 'boolean' ? bot : null}
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue={defaultBooleanValue}
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  enableIndeterminateState
                  label="Bots"
                  onChange={value => {
                    setColummBotFilter({
                      columnId: column.id,
                      bot: typeof value === 'boolean' ? value : undefined,
                    })
                  }}
                  right={getCheckboxRight(filteredItemsMetadata.bot)}
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

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     { ...column.filters, subjectTypes: undefined },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'subject_types'}
                iconName="file"
                isOpen={openedOptionCategories.has('subject_types')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('subject_types')
                    : undefined
                }
                title="Subject type"
                right={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : ''
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

                  const counterMetadataProps =
                    filteredItemsMetadata.subjectType[item.subjectType]

                  return (
                    <Checkbox
                      key={`notification-subject-type-option-${
                        item.subjectType
                      }`}
                      checked={checked}
                      checkedBackgroundThemeColor={item.color}
                      containerStyle={
                        sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                      }
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
                      right={getCheckboxRight(counterMetadataProps || {}, {
                        backgroundColor:
                          item.subjectType === 'RepositoryVulnerabilityAlert' &&
                          counterMetadataProps &&
                          counterMetadataProps.unread
                            ? 'red'
                            : undefined,
                      })}
                      squareContainerStyle={
                        sharedColumnOptionsStyles.checkboxSquareContainer
                      }
                      // uncheckedForegroundThemeColor={item.color}
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

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     {
            //       ...column.filters,
            //       notifications: {
            //         ...(column.filters && column.filters.notifications),
            //         reasons: undefined,
            //       },
            //     },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'notification_reason'}
                iconName="rss"
                isOpen={openedOptionCategories.has('notification_reason')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('notification_reason')
                    : undefined
                }
                title="Subscription reason"
                right={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : ''
                }
              >
                {notificationReasonOptions.map(item => {
                  const checked =
                    filters && typeof filters[item.reason] === 'boolean'
                      ? filters[item.reason]
                      : null

                  const counterMetadataProps =
                    filteredItemsMetadata.subscriptionReason[item.reason]

                  return (
                    <Checkbox
                      key={`notification-reason-option-${item.reason}`}
                      checked={checked}
                      checkedBackgroundThemeColor={item.color}
                      containerStyle={
                        sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                      }
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
                      right={getCheckboxRight(counterMetadataProps || {}, {
                        backgroundColor:
                          item.reason === 'security_alert' &&
                          counterMetadataProps &&
                          counterMetadataProps.unread
                            ? 'red'
                            : undefined,
                      })}
                      squareContainerStyle={
                        sharedColumnOptionsStyles.checkboxSquareContainer
                      }
                      // uncheckedForegroundThemeColor={item.color}
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

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     {
            //       ...column.filters,
            //       activity: {
            //         ...(column.filters && column.filters.activity),
            //         actions: undefined,
            //       },
            //     },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={filterRecordHasAnyForcedValue(filters)}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'event_action'}
                iconName="note"
                isOpen={openedOptionCategories.has('event_action')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('event_action')
                    : undefined
                }
                title="Event action"
                right={
                  filterRecordHasAnyForcedValue(filters)
                    ? `${countMetadata.checked}/${countMetadata.total}`
                    : ''
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
                      checked={checked}
                      containerStyle={
                        sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                      }
                      defaultValue={defaultBooleanValue}
                      enableIndeterminateState={enableIndeterminateState}
                      label={item.label}
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
                      right={getCheckboxRight(
                        filteredItemsMetadata.eventAction[item.action] || {},
                      )}
                      squareContainerStyle={
                        sharedColumnOptionsStyles.checkboxSquareContainer
                      }
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

            // const filteredItemsMetadata = getItemsFilterMetadata(
            //   column.type,
            //   getFilteredItems(
            //     column.type,
            //     allItems,
            //     {
            //       ...column.filters,
            //       private: undefined,
            //     },
            //     getFilteredItemsOptions,
            //   ),
            // )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  !!column.filters &&
                  typeof column.filters.private === 'boolean'
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'privacy'}
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
                right={
                  isPrivateChecked && !isPublicChecked
                    ? 'Private'
                    : !isPrivateChecked && isPublicChecked
                    ? 'Public'
                    : ''
                }
                title="Privacy"
              >
                <Checkbox
                  checked={
                    isPublicChecked && isPrivateChecked ? null : isPublicChecked
                  }
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue
                  enableIndeterminateState={isPublicChecked && isPrivateChecked}
                  label="Public"
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  onChange={() => {
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
                  right={getCheckboxRight(filteredItemsMetadata.privacy.public)}
                />

                <Checkbox
                  checked={
                    isPublicChecked && isPrivateChecked
                      ? null
                      : isPrivateChecked
                  }
                  containerStyle={
                    sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                  }
                  defaultValue
                  enableIndeterminateState={isPublicChecked && isPrivateChecked}
                  label="Private"
                  squareContainerStyle={
                    sharedColumnOptionsStyles.checkboxSquareContainer
                  }
                  onChange={() => {
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
                  right={getCheckboxRight(
                    filteredItemsMetadata.privacy.private,
                  )}
                />
              </ColumnOptionsRow>
            )
          })()}

        {allColumnOptionCategories.includes('repos') &&
          (() => {
            const defaultBooleanValue = true

            const isOwnerFilterStrict =
              filterRecordWithThisValueCount(ownerFilters, true) >= 1
            const isRepoFilterStrict =
              filterRecordWithThisValueCount(repoFilters, true) >= 1

            const ownerFilterHasForcedValue = filterRecordHasAnyForcedValue(
              ownerFilters,
            )
            const repoFilterHasForcedValue = filterRecordHasAnyForcedValue(
              repoFilters,
            )

            const owners = _.sortBy(
              Object.keys(
                (ownerOrRepoFilteredItemsMetadata &&
                  ownerOrRepoFilteredItemsMetadata.owners) ||
                  {},
              ),
            )

            const ownerCountMetadata = getFilterCountMetadata(
              ownerFilters,
              owners.length,
              defaultBooleanValue,
            )

            return (
              <ColumnOptionsRow
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  // column.type !== 'issue_or_pr' &&
                  ownerFilterHasForcedValue || repoFilterHasForcedValue
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                hideSeparator={lastColumnCategory === 'repos'}
                iconName="repo"
                isOpen={openedOptionCategories.has('repos')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('repos')
                    : undefined
                }
                title="Repositories"
                right={
                  ownerFilterHasForcedValue || repoFilterHasForcedValue
                    ? `${ownerCountMetadata.checked}/${
                        ownerCountMetadata.total
                      }`
                    : ''
                }
              >
                {owners.map(owner => {
                  const ownerItem =
                    ownerOrRepoFilteredItemsMetadata &&
                    ownerOrRepoFilteredItemsMetadata.owners[owner]
                  if (!ownerItem) return null

                  const ownerFiltersWithRepo =
                    ownerFiltersWithRepos && ownerFiltersWithRepos[owner]
                      ? ownerFiltersWithRepos[owner]
                      : null

                  const ownerChecked =
                    ownerFilters && typeof ownerFilters[owner] === 'boolean'
                      ? ownerFilters[owner]
                      : null

                  const repos = _.sortBy(Object.keys(ownerItem.repos))

                  const thisOwnerRepoFilters =
                    ownerFiltersWithRepos &&
                    ownerFiltersWithRepos[owner] &&
                    ownerFiltersWithRepos[owner]!.repos
                  const thisOwnerHasStrictRepoFilter =
                    filterRecordWithThisValueCount(
                      thisOwnerRepoFilters,
                      defaultBooleanValue,
                    ) >= 1

                  const thisOwnerRepoFilterHasForcedValue = filterRecordHasAnyForcedValue(
                    thisOwnerRepoFilters,
                  )

                  return (
                    <Fragment key={`owner-option-fragment-${owner}`}>
                      <Checkbox
                        key={`owner-option-${owner}`}
                        checked={ownerChecked}
                        containerStyle={
                          sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding
                        }
                        defaultValue={defaultBooleanValue}
                        // disabled={
                        //   !!(
                        //     column.type === 'issue_or_pr' &&
                        //     ownerChecked &&
                        //     !filterRecordWithThisValueCount(
                        //       column.filters && column.filters.involves,
                        //       true,
                        //     )
                        //   )
                        // }
                        enableIndeterminateState={
                          !(isOwnerFilterStrict || isRepoFilterStrict) ||
                          thisOwnerHasStrictRepoFilter ||
                          ownerChecked === defaultBooleanValue
                        }
                        label={owner}
                        labelTooltip={owner}
                        left={
                          <Avatar
                            size={defaultCheckboxSize}
                            shape="circle"
                            username={owner}
                          />
                        }
                        onChange={value => {
                          setColumnOwnerFilter({
                            columnId: column.id,
                            owner,
                            value: isOwnerFilterStrict
                              ? typeof value === 'boolean'
                                ? defaultBooleanValue
                                : null
                              : ownerFilterHasForcedValue
                              ? typeof value === 'boolean'
                                ? !defaultBooleanValue
                                : null
                              : value,
                          })
                        }}
                        right={getCheckboxRight(ownerItem.metadata!)}
                        squareContainerStyle={
                          sharedColumnOptionsStyles.checkboxSquareContainer
                        }
                      />

                      {repos.map(repo => {
                        const repoFullName = `${owner}/${repo}`

                        const repoItem = ownerItem.repos[repo]
                        if (!repoItem) return null

                        const repoChecked =
                          ownerFiltersWithRepo &&
                          ownerFiltersWithRepo.repos &&
                          typeof ownerFiltersWithRepo.repos[repo] === 'boolean'
                            ? ownerFiltersWithRepo.repos[repo]
                            : null

                        const disabled = ownerChecked === false

                        return (
                          <Checkbox
                            key={`owner-repo-option-${owner}/${repo}`}
                            checked={disabled ? false : repoChecked}
                            containerStyle={[
                              sharedColumnOptionsStyles.fullWidthCheckboxContainerWithPadding,
                              {
                                marginLeft:
                                  defaultCheckboxSize + checkboxLabelSpacing,
                              },
                            ]}
                            defaultValue={defaultBooleanValue}
                            disabled={disabled}
                            enableIndeterminateState={
                              !disabled &&
                              (!(isOwnerFilterStrict || isRepoFilterStrict) ||
                                (ownerChecked === true &&
                                  !thisOwnerHasStrictRepoFilter) ||
                                repoChecked === defaultBooleanValue)
                            }
                            label={repo}
                            labelTooltip={repoFullName}
                            onChange={value => {
                              setColumnRepoFilter({
                                columnId: column.id,
                                owner,
                                repo,
                                value: thisOwnerHasStrictRepoFilter
                                  ? typeof value === 'boolean'
                                    ? defaultBooleanValue
                                    : null
                                  : thisOwnerRepoFilterHasForcedValue
                                  ? isRepoFilterStrict &&
                                    value !== !defaultBooleanValue
                                    ? defaultBooleanValue
                                    : typeof value === 'boolean'
                                    ? !defaultBooleanValue
                                    : null
                                  : value,
                              })
                            }}
                            right={getCheckboxRight(repoItem)}
                            squareContainerStyle={
                              sharedColumnOptionsStyles.checkboxSquareContainer
                            }
                          />
                        )
                      })}
                    </Fragment>
                  )
                })}
              </ColumnOptionsRow>
            )
          })()}
      </ScrollView>

      <Separator horizontal />

      <Spacer height={contentPadding / 2} />

      <View
        style={{
          paddingVertical: contentPadding / 2,
          paddingHorizontal: contentPadding,
        }}
      >
        <Button
          children="Reset filters"
          disabled={
            !columnHasAnyFilter(column.type, {
              ...column.filters,
              ...(column.type === 'notifications' && {
                notifications: {
                  ...(column.filters && column.filters.notifications),
                  participating: undefined,
                },
              }),
              // ...(column.type === 'issue_or_pr' && {
              //   involves: undefined,
              //   owners: undefined,
              // }),
            })
          }
          onPress={() => {
            clearColumnFilters({ columnId: column.id })
          }}
        />
      </View>

      <Separator horizontal />
    </ThemedView>
  )
})

ColumnFilters.displayName = 'ColumnFilters'
