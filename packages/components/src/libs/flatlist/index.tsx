import React from 'react'
import { FlatList as FlatListOriginal } from 'react-native'

import { CrossPlatformFlatList, CrossPlatformFlatListProps } from './types'

export interface FlatListProps<ItemT>
  extends CrossPlatformFlatListProps<ItemT> {}

export class FlatList<ItemT> extends React.Component<FlatListProps<ItemT>>
  implements CrossPlatformFlatList<ItemT> {
  ref = React.createRef<CrossPlatformFlatList<ItemT>>()

  scrollToItem(params: {
    animated?: boolean
    item: ItemT
    viewPosition?: number
  }) {
    if (this.ref.current) this.ref.current.scrollToItem(params)
  }

  render() {
    return <FlatListOriginal ref={this.ref as any} {...this.props} />
  }
}
