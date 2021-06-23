import {
  Column,
  getFilteredItems,
  getItemsFilterMetadata,
  getOwnerAndRepoFormattedFilter,
  getUserAvatarByUsername,
  getUsernamesFromFilter,
} from '@devhub/core'
import _ from 'lodash'
import React, { useCallback, useMemo } from 'react'
import { PixelRatio } from 'react-native'
import { useDispatch } from 'react-redux'

import { useColumn } from '../../hooks/use-column'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxState } from '../../hooks/use-redux-state'
import * as actions from '../../redux/actions'
import * as selectors from '../../redux/selectors'
import {
  cardsGenericOwnerFilterBarTotalHeight,
  GenericOwnerFilterBar,
  GenericOwnerFilterBarProps,
  OwnerItemT,
} from './partials/GenericOwnerFilterBar'

export interface CardsOwnerFilterBarProps {
  columnId: Column['id']
  key: string
}

const ownersCacheByColumnId = new Map<string, Set<string>>()
const lastUsernameCacheByColumnId = new Map<string, string | undefined>()

export const cardsOwnerFilterBarTotalHeight =
  cardsGenericOwnerFilterBarTotalHeight

export const CardsOwnerFilterBar = React.memo(
  (props: CardsOwnerFilterBarProps) => {
    const { columnId } = props

    const { column, dashboardFromUsername } = useColumn(columnId)
    const { allItems } = useColumnData(columnId)

    const dispatch = useDispatch()
    const plan = useReduxState(selectors.currentUserPlanSelector)

    const getFilteredItemsOptions = useMemo<
      Parameters<typeof getFilteredItems>[3]
    >(
      () => ({
        dashboardFromUsername,
        mergeSimilar: false,
        plan,
      }),
      [dashboardFromUsername, plan],
    )

    const {
      allExistingOwners,
      allForcedRepos,
      allIncludedOwners,
      ownerFilters,
    } = useMemo(
      () => getOwnerAndRepoFormattedFilter(column && column.filters),
      [column && column.filters],
    )

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
            dashboardFromUsername,
            forceIncludeTheseOwners: allExistingOwners,
            forceIncludeTheseRepos: allForcedRepos,
            plan,
          },
        ),
      [
        allExistingOwners,
        allForcedRepos,
        allItems,
        column && column.filters,
        column && column.type,
        dashboardFromUsername,
        plan,
      ],
    )

    // on issues/prs column, reset owners list cache
    // if changed the usernames in the filters
    useMemo(() => {
      const newPreviousUsernameCacheValue =
        (column &&
          column.type === 'issue_or_pr' &&
          getUsernamesFromFilter('issue_or_pr', column.filters, {
            blacklist: ['owner'],
          }).includedUsernames[0]) ||
        undefined

      if (
        newPreviousUsernameCacheValue !==
        lastUsernameCacheByColumnId.get(columnId)
      ) {
        lastUsernameCacheByColumnId.set(columnId, newPreviousUsernameCacheValue)
        ownersCacheByColumnId.delete(columnId)
      }
    }, [
      columnId,
      column && column.type === 'issue_or_pr' ? allItems : undefined,
    ])

    let owners = Object.keys(
      (ownerOrRepoFilteredItemsMetadata &&
        ownerOrRepoFilteredItemsMetadata.owners) ||
        {},
    )
    owners = ownersCacheByColumnId.get(columnId)
      ? _.uniq(Array.from(ownersCacheByColumnId.get(columnId)!).concat(owners))
      : owners

    const data = owners
      .map((owner, index) => {
        const ownerItem =
          ownerOrRepoFilteredItemsMetadata &&
          ownerOrRepoFilteredItemsMetadata.owners[owner]

        if (column && column.type === 'issue_or_pr') {
          ownersCacheByColumnId.set(
            columnId,
            ownersCacheByColumnId.get(columnId) || new Set(),
          )
          ownersCacheByColumnId.get(columnId)!.add(owner)
        }

        return {
          avatarURL: getUserAvatarByUsername(
            owner,
            { baseURL: undefined },
            PixelRatio.getPixelSizeForLayoutSize,
          ), // TODO: baseURL
          hasUnread: !!(
            ownerItem &&
            ownerItem.metadata &&
            ownerItem.metadata.unread > 0
          ),
          value: allIncludedOwners.includes(owner.toLowerCase())
            ? true
            : ownerFilters &&
              typeof ownerFilters[owner.toLowerCase()] === 'boolean'
            ? ownerFilters[owner.toLowerCase()]
            : null,
          owner,
          index,
        }
      })
      .filter(Boolean) as OwnerItemT[]
    // .sort(
    //   column && column.type === 'issue_or_pr'
    //     ? () => 0
    //     : (a, b) =>
    //         a!.hasUnread && !b!.hasUnread
    //           ? -1
    //           : !a!.hasUnread && b!.hasUnread
    //           ? 1
    //           : 0,
    // ) as OwnerItemT[]

    const onItemPress = useCallback<GenericOwnerFilterBarProps['onItemPress']>(
      (item, setOrReplace, value) => {
        if (setOrReplace === 'replace') {
          if (!value && column && column.type === 'issue_or_pr') {
            dispatch(
              actions.replaceColumnFilters({
                columnId,
                filters: {
                  ...(column && column.filters),
                  owners: _.mapValues(
                    (column && column.filters && column.filters.owners) || {},
                    () => ({
                      value: true,
                      repos: undefined,
                    }),
                  ),
                },
              }),
            )
          } else {
            dispatch(
              actions.replaceColumnOwnerFilter({
                columnId,
                owner: value ? item.owner : null,
              }),
            )
          }
        } else {
          dispatch(
            actions.setColumnOwnerFilter({
              columnId,
              owner: item.owner,
              value,
            }),
          )
          return
        }
      },
      [columnId, column && column.type],
    )

    const memoizedDataObjReference = useMemo(() => data, [JSON.stringify(data)])

    return (
      <GenericOwnerFilterBar
        columnType={column && column.type}
        data={memoizedDataObjReference}
        onItemPress={onItemPress}
      />
    )
  },
)

CardsOwnerFilterBar.displayName = 'CardsOwnerFilterBar'
