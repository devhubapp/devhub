import React, { useContext } from 'react'

import {
  ColumnSubscription,
  getFilteredItems,
  getItemsFilterMetadata,
  getItemsFromSubscriptions,
} from '@devhub/core'
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
  const subscriptions = useReduxState(selectors.subscriptionsArrSelector)

  const totalUnreadCount = columns.reduce((acc, column) => {
    const getFilteredItemsOptions: Parameters<typeof getFilteredItems>[3] = {
      mergeSimilar: false,
    }

    const columnSubscriptions = column.subscriptionIds
      .map(subscriptionId =>
        subscriptions.find(s => s && s.id && s.id === subscriptionId),
      )
      .filter(Boolean) as ColumnSubscription[]

    const columnItems = getItemsFromSubscriptions(columnSubscriptions)

    const filteredItemsMetadata = getItemsFilterMetadata(
      column.type,
      getFilteredItems(
        column.type,
        columnItems,
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
