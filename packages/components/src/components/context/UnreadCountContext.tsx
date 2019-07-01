import React, { useContext } from 'react'

import {
  EnhancedItem,
  getFilteredItems,
  getItemsFilterMetadata,
} from '@devhub/core'
import { useColumnData } from '../../hooks/use-column-data'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'

export interface UnreadCountProviderProps {
  children?: React.ReactNode
}

export type UnreadCountProviderState = number

export const UnreadCountContext = React.createContext<UnreadCountProviderState>(
  0,
)
UnreadCountContext.displayName = 'UnreadCountContext'

export function UnreadCountProvider(props: UnreadCountProviderProps) {
  const columns = useReduxState(selectors.columnsArrSelector)

  // TODO: Fix memoization
  const subscriptionsDataSelector = selectors.createSubscriptionsDataSelector()

  const totalUnreadCount = columns.reduce((acc, column) => {
    const getFilteredItemsOptions: Parameters<typeof getFilteredItems>[3] = {
      mergeSimilar: false,
    }

    const allItems: EnhancedItem[] = useReduxState(state =>
      subscriptionsDataSelector(state, column.subscriptionIds),
    )

    const filteredItemsMetadata = getItemsFilterMetadata(
      column.type,
      getFilteredItems(
        column.type,
        allItems,
        column.filters,
        getFilteredItemsOptions,
      ),
    )

    const inbox =
      column.type === 'notifications' &&
      column.filters &&
      column.filters.notifications &&
      column.filters.notifications.participating
        ? 'participating'
        : 'all'

    const columnUnreadCount = filteredItemsMetadata.inbox[inbox].unread
    return acc + columnUnreadCount
  }, 0)

  return (
    <UnreadCountContext.Provider value={totalUnreadCount}>
      {props.children}
    </UnreadCountContext.Provider>
  )
}

export const UnreadCountConsumer = UnreadCountContext.Consumer
;(UnreadCountConsumer as any).displayName = 'UnreadCountConsumer'

export function useUnreadCount() {
  return useContext(UnreadCountContext)
}
