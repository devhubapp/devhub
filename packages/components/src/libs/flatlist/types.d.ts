import React, { Ref } from 'react'
import { FlatList, FlatListProps } from 'react-native'

export interface CrossPlatformFlatListProps<ItemT>
  extends FlatListProps<ItemT> {
  // data: FlatListProps<ItemT>['data']
  // horizontal?: FlatListProps<ItemT>['horizontal']
  // renderItem: FlatListProps<ItemT>['renderItem']
}

export class CrossPlatformFlatList<ItemT> extends React.Component<
  CrossPlatformFlatListProps<ItemT>
> {
  scrollToItem: FlatList<ItemT>['scrollToItem']
}
