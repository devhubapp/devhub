import {
  ActivityColumn,
  Column,
  getFilteredItems,
  getItemsFilterMetadata,
  getUserAvatarByUsername,
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

export interface CardsWatchingOwnerFilterBarProps {
  columnId: Column['id']
  key: string
}

export const cardsWatchingOwnerFilterBarTotalHeight = cardsGenericOwnerFilterBarTotalHeight

export const CardsWatchingOwnerFilterBar = React.memo(
  (props: CardsWatchingOwnerFilterBarProps) => {
    const { columnId } = props

    const { column: _column, dashboardFromUsername } = useColumn(columnId)
    const { allItems } = useColumnData(columnId)

    const column = _column as ActivityColumn

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

    const filteredItemsMetadata = useMemo(
      () =>
        column &&
        getItemsFilterMetadata(
          column.type,
          getFilteredItems(
            column.type,
            allItems,
            {
              ...column.filters,
              watching: undefined,
            },
            getFilteredItemsOptions,
          ),
          { dashboardFromUsername, plan },
        ),
      [column && column.type, allItems, column && column.filters, plan],
    )

    const owners = Object.keys(
      (filteredItemsMetadata && filteredItemsMetadata.watching) || {},
    )

    const data = owners
      .map((owner, index) => {
        const ownerItem =
          filteredItemsMetadata && filteredItemsMetadata.watching[owner]

        return {
          avatarURL: getUserAvatarByUsername(
            owner,
            { baseURL: undefined },
            PixelRatio.getPixelSizeForLayoutSize,
          ), // TODO: baseURL
          hasUnread: !!(ownerItem && ownerItem.unread > 0),
          value:
            column &&
            column.filters &&
            column.filters.watching &&
            typeof column.filters.watching[owner.toLowerCase()] === 'boolean'
              ? column.filters.watching[owner.toLowerCase()]
              : null,
          owner,
          index,
        }
      })
      .filter(Boolean) as OwnerItemT[]
    // .sort((a, b) =>
    //   a!.hasUnread && !b!.hasUnread
    //     ? -1
    //     : !a!.hasUnread && b!.hasUnread
    //     ? 1
    //     : 0,
    // ) as OwnerItemT[]

    const onItemPress = useCallback<GenericOwnerFilterBarProps['onItemPress']>(
      (item, setOrReplace, value) => {
        if (setOrReplace === 'replace') {
          dispatch(
            actions.replaceColumnWatchingFilter({
              columnId,
              owner: value ? item.owner : null,
            }),
          )
        } else {
          dispatch(
            actions.setColumnWatchingFilter({
              columnId,
              owner: item.owner,
              value,
            }),
          )
          return
        }
      },
      [columnId],
    )

    const memoizedDataObjReference = useMemo(() => data, [JSON.stringify(data)])

    return (
      <GenericOwnerFilterBar
        data={memoizedDataObjReference}
        onItemPress={onItemPress}
      />
    )
  },
)

CardsWatchingOwnerFilterBar.displayName = 'CardsWatchingOwnerFilterBar'
