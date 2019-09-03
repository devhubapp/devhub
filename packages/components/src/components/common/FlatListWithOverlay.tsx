import React from 'react'
import { FlatList, FlatListProps } from 'react-native'

import {
  ScrollViewWithOverlay,
  ScrollViewWithOverlayProps,
} from './ScrollViewWithOverlay'

export interface FlatListWithOverlayProps<TItem>
  extends FlatListProps<TItem>,
    ScrollViewWithOverlayProps {}

export const FlatListWithOverlay = React.forwardRef(
  (props: FlatListWithOverlayProps<any>, ref: any) => {
    return (
      <ScrollViewWithOverlay
        ref={ref}
        {...props}
        ScrollViewComponent={FlatList}
      />
    )
  },
)

FlatListWithOverlay.displayName = 'FlatListWithOverlay'
