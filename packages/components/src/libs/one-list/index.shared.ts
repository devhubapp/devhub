import React from 'react'
import { FlatListProps, ViewProps } from 'react-native'

// TODO: take safeAreaInsets into consideration when scrolling to item
// TODO: support "animated" param on web
export interface OneListInstance {
  scrollToStart: (params?: { animated?: boolean }) => void
  scrollToEnd: (params?: { animated?: boolean }) => void
  scrollToIndex: (
    index: number,
    payload?: {
      animated?: boolean
      alignment?: 'start' | 'center' | 'end' | 'smart'
    },
  ) => void
}

export interface OneListProps<ItemT> {
  ListEmptyComponent?: React.ComponentType
  children?: never
  containerStyle?: ViewProps['style']
  data: ItemT[]
  disableVirtualization?: boolean
  estimatedItemSize: number
  forceRerenderOnRefChange?: any
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
  listStyle?: ViewProps['style']
  onVisibleItemsChanged?: (fromIndex: number, toIndex: number) => void
  overscanCount: number
  pagingEnabled?: boolean
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto'
  refreshControl?: FlatListProps<any>['refreshControl'] // TODO: Web support
  renderItem: (info: {
    item: ItemT
    index: number
  }) => React.ReactElement | null
  safeAreaInsets?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
  snapToAlignment?: 'start' | 'center' | 'end'
}
