import _ from 'lodash'
import React, { Fragment, useRef, useState } from 'react'
import { View } from 'react-native'

import {
  Column,
  columnHasAnyFilter,
  eventActions,
  eventSubjectTypes,
  filterRecordHasAnyForcedValue,
  filterRecordWithThisValueCount,
  getEventActionMetadata,
  getFilteredItems,
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
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxAction } from '../../hooks/use-redux-action'
import { useReduxState } from '../../hooks/use-redux-state'
import { Platform } from '../../libs/platform'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderHeight,
  columnHeaderItemContentSize,
  contentPadding,
} from '../../styles/variables'
import { CardItemSeparator } from '../cards/partials/CardItemSeparator'
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
import { FullHeightScrollView } from '../common/FullHeightScrollView'
import { Separator } from '../common/Separator'
import { Spacer } from '../common/Spacer'
import { useAppLayout } from '../context/LayoutContext'
import { keyboardShortcutsById } from '../modals/KeyboardShortcutsModal'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { getColumnHeaderThemeColors } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
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

export interface ColumnOptionsProps {
  availableHeight: number
  column: Column
  columnIndex: number
  forceOpenAll?: boolean
  fullHeight?: boolean
  startWithFiltersExpanded?: boolean
}

export type ColumnOptionCategory =
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

export const ColumnOptions = React.memo((props: ColumnOptionsProps) => {
  const {
    availableHeight,
    column,
    columnIndex,
    forceOpenAll,
    fullHeight,
    startWithFiltersExpanded,
  } = props

  const getFilteredItemsOptions: Parameters<typeof getFilteredItems>[3] = {
    mergeSimilar: false,
  }

  const { allItems } = useColumnData(column.id, getFilteredItemsOptions)

  const {
    allForcedOwners,
    allForcedRepos,
    ownerFilters,
    ownerFiltersWithRepos,
    repoFilters,
  } = getOwnerAndRepoFormattedFilter(column.filters)

  const ownerOrRepoFilteredItemsMetadata = getItemsFilterMetadata(
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
  )

  const _owners = Object.keys(ownerOrRepoFilteredItemsMetadata.owners || {})
  const _shouldShowOwnerOrRepoFilters =
    _owners.length >= 1 ||
    (_owners.length === 1 &&
      ownerOrRepoFilteredItemsMetadata.owners[_owners[0]].repos &&
      Object.keys(ownerOrRepoFilteredItemsMetadata.owners[_owners[0]].repos)
        .length >= 1)

  const involvingUsers = _.sortBy(
    Object.keys(
      (column.filters &&
        (column.filters as IssueOrPullRequestColumnFilters).involves) ||
        {},
    ),
  )

  const _shouldShowInvolvesFilter =
    column.type === 'issue_or_pr' &&
    !!involvingUsers &&
    involvingUsers.length >= 1

  const _allColumnOptionCategories: Array<ColumnOptionCategory | false> = [
    column.type === 'notifications' && 'inbox',
    'saved_for_later',
    'unread',
    'state',
    'draft',
    'bot',
    _shouldShowInvolvesFilter && 'involves',
    'subject_types',
    column.type === 'activity' && 'event_action',
    column.type === 'notifications' && 'notification_reason',
    column.type === 'notifications' && 'privacy',
    _shouldShowOwnerOrRepoFilters && 'repos',
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

  const clearColumnFilters = useReduxAction(actions.clearColumnFilters)
  const deleteColumn = useReduxAction(actions.deleteColumn)
  const moveColumn = useReduxAction(actions.moveColumn)
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

  const toggleOpenedOptionCategory = (optionCategory: ColumnOptionCategory) => {
    setOpenedOptionCategories(set => {
      const isOpen = set.has(optionCategory)
      if (allowOnlyOneCategoryToBeOpenedRef.current) set.clear()
      isOpen ? set.delete(optionCategory) : set.add(optionCategory)

      if (set.size === 0) allowOnlyOneCategoryToBeOpenedRef.current = true

      return new Set(set)
    })
  }

  const allItemsMetadata = getItemsFilterMetadata(column.type, allItems)

  const inbox =
    column.type === 'notifications' &&
    column.filters &&
    column.filters.notifications &&
    column.filters.notifications.participating
      ? 'participating'
      : 'all'

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
      backgroundColor={theme =>
        getColumnHeaderThemeColors(theme.backgroundColor).normal
      }
      style={{
        alignSelf: 'stretch',
        height: fullHeight ? availableHeight : 'auto',
      }}
      // onLayout={e => {
      //   setContainerWidth(e.nativeEvent.layout.width)
      // }}
    >
      <FullHeightScrollView
        alwaysBounceHorizontal={false}
        alwaysBounceVertical
        bounces
        showsHorizontalScrollIndicator={false}
        style={[
          sharedStyles.flex,
          { maxHeight: availableHeight - columnHeaderHeight - 4 },
        ]}
      >
        {allColumnOptionCategories.includes('inbox') &&
          column.type === 'notifications' && (
            <ColumnOptionsInbox
              enableBackgroundHover={allowToggleCategories}
              getCheckboxPropsFor={i => ({
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
                analyticsLabel="involves"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={false}
                headerItemFixedIconSize={columnHeaderItemContentSize}
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
                        style={{
                          flex: 1,
                          lineHeight: defaultCheckboxSize,
                        }}
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
                  //     analyticsLabel={undefined}
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

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, saved: undefined },
                getFilteredItemsOptions,
              ),
            )

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
                // right={
                //   savedForLater === true
                //     ? 'Saved only'
                //     : savedForLater === false
                //     ? 'Excluded'
                //     : 'Included'
                // }
                title="Saved for later"
              >
                <Checkbox
                  analyticsLabel="save_for_later"
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
                  label="Saved for later"
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

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, unread: undefined },
                getFilteredItemsOptions,
              ),
            )

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
                // right={
                //   isReadChecked && !isUnreadChecked
                //     ? 'Read'
                //     : !isReadChecked && isUnreadChecked
                //     ? 'Unread'
                //     : 'All'
                // }
                title="Read status"
              >
                <Checkbox
                  analyticsLabel="read"
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
                  analyticsLabel="unread"
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
            // const countMetadata = getFilterCountMetadata(
            //   filters,
            //   stateTypeOptions.length,
            //   defaultBooleanValue,
            // )

            const supportsOnlyOne = true // column.type === 'issue_or_pr'

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, state: undefined },
                getFilteredItemsOptions,
              ),
            )

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
                // right={
                //   filterRecordHasAnyForcedValue(filters)
                //     ? `${countMetadata.checked}/${countMetadata.total}`
                //     : 'All'
                // }
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

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, draft: undefined },
                getFilteredItemsOptions,
              ),
            )

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
                // right={
                //   draft === true
                //     ? 'Draft only'
                //     : draft === false
                //     ? 'Excluded'
                //     : 'Included'
                // }
              >
                <Checkbox
                  key="draft-type-option"
                  analyticsLabel={undefined}
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

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, bot: undefined },
                getFilteredItemsOptions,
              ),
            )

            return (
              <ColumnOptionsRow
                analyticsLabel="bot_options_row"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={typeof bot === 'boolean'}
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="hubot"
                isOpen={openedOptionCategories.has('bot')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('bot')
                    : undefined
                }
                title="Bots"
                // right={
                //   bot === true
                //     ? 'Bots only'
                //     : bot === false
                //     ? 'Excluded'
                //     : 'Included'
                // }
              >
                <Checkbox
                  key="bot-type-option"
                  analyticsLabel={undefined}
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
            // const countMetadata = getFilterCountMetadata(
            //   filters,
            //   subjectTypeOptions.length,
            //   defaultBooleanValue,
            // )

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                { ...column.filters, subjectTypes: undefined },
                getFilteredItemsOptions,
              ),
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
                // right={
                //   filterRecordHasAnyForcedValue(filters)
                //     ? `${countMetadata.checked}/${countMetadata.total}`
                //     : 'All'
                // }
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
                      analyticsLabel={undefined}
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
            // const countMetadata = getFilterCountMetadata(
            //   filters,
            //   notificationReasonOptions.length,
            //   defaultBooleanValue,
            // )

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                {
                  ...column.filters,
                  notifications: {
                    ...(column.filters && column.filters.notifications),
                    reasons: undefined,
                  },
                },
                getFilteredItemsOptions,
              ),
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
                // right={
                //   filterRecordHasAnyForcedValue(filters)
                //     ? `${countMetadata.checked}/${countMetadata.total}`
                //     : 'All'
                // }
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
                      analyticsLabel={undefined}
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
            // const countMetadata = getFilterCountMetadata(
            //   filters,
            //   eventActionOptions.length,
            //   defaultBooleanValue,
            // )

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                {
                  ...column.filters,
                  activity: {
                    ...(column.filters && column.filters.activity),
                    actions: undefined,
                  },
                },
                getFilteredItemsOptions,
              ),
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
                // right={
                //   filterRecordHasAnyForcedValue(filters)
                //     ? `${countMetadata.checked}/${countMetadata.total}`
                //     : 'All'
                // }
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

            const filteredItemsMetadata = getItemsFilterMetadata(
              column.type,
              getFilteredItems(
                column.type,
                allItems,
                {
                  ...column.filters,
                  private: undefined,
                },
                getFilteredItemsOptions,
              ),
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
                // right={
                //   isPrivateChecked && !isPublicChecked
                //     ? 'Private'
                //     : !isPrivateChecked && isPublicChecked
                //     ? 'Public'
                //     : 'All'
                // }
                title="Privacy"
              >
                <Checkbox
                  analyticsLabel="public"
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
                  analyticsLabel="private"
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
              Object.keys(ownerOrRepoFilteredItemsMetadata.owners),
            )

            // const ownerCountMetadata = getFilterCountMetadata(
            //   ownerFilters,
            //   owners.length,
            //   defaultBooleanValue,
            // )

            return (
              <ColumnOptionsRow
                analyticsLabel="repositories"
                enableBackgroundHover={allowToggleCategories}
                hasChanged={
                  // column.type !== 'issue_or_pr' &&
                  ownerFilterHasForcedValue || repoFilterHasForcedValue
                }
                headerItemFixedIconSize={columnHeaderItemContentSize}
                iconName="repo"
                isOpen={openedOptionCategories.has('repos')}
                onToggle={
                  allowToggleCategories
                    ? () => toggleOpenedOptionCategory('repos')
                    : undefined
                }
                title="Repositories"
                // right={
                //   ownerFilterHasForcedValue || repoFilterHasForcedValue
                //     ? `${ownerCountMetadata.checked}/${ownerCountMetadata.total}`
                //     : 'All'
                // }
              >
                {owners.map(owner => {
                  const ownerItem =
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
                        analyticsLabel={undefined}
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
                            analyticsLabel={undefined}
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

        <Spacer flex={1} minHeight={contentPadding / 2} />

        <View
          style={{
            paddingVertical: contentPadding / 2,
            paddingHorizontal: contentPadding,
          }}
        >
          <Button
            analyticsLabel="clear_column_filters"
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
      </FullHeightScrollView>

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

      <CardItemSeparator muted />
    </ThemedView>
  )
})
