import React from 'react'
import { FlatListProps } from 'react-native'

// TODO: take safeAreaInsets into consideration when scrolling to item
export interface OneListInstance {
  scrollToStart: () => void
  scrollToEnd: () => void
  scrollToIndex: (
    index: number,
    payload?: { alignment?: 'start' | 'center' | 'end' | 'smart' },
  ) => void
}

export interface OneListProps<ItemT> {
  ListEmptyComponent?: React.ComponentType
  data: ItemT[]
  disableVirtualization?: boolean
  estimatedItemSize: number
  footer?: {
    Component: React.ComponentType
    size: number
    sticky?: boolean
  }
  getItemKey: (item: ItemT, index: number) => string
  getItemSize: (item: ItemT, index: number) => number
  header?: {
    Component: React.ComponentType
    size: number
    sticky?: boolean
  }
  horizontal?: boolean
  itemSeparator?: {
    Component: React.ComponentType<{
      leading?: { item: ItemT; index: number }
      trailing?: { item: ItemT; index: number }
    }>
    size: number
  }
  onVisibleItemsChanged?: (fromIndex: number, toIndex: number) => void
  overscanCount: number
  pagingEnabled?: boolean
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  refreshControl?: FlatListProps<any>['refreshControl'] // TODO: Web support
  renderItem: (info: { item: ItemT; index: number }) => React.ReactElement
  safeAreaInsets?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  snapToAlignment?: 'start' | 'center' | 'end'
}
