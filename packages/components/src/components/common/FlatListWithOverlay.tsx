import React from 'react'

import { FlatList, FlatListProps } from '../../libs/flatlist'
import {
  ScrollViewWithOverlay,
  ScrollViewWithOverlayProps,
} from './ScrollViewWithOverlay'

export interface FlatListWithOverlayProps<TItem>
  extends FlatListProps<TItem>,
    ScrollViewWithOverlayProps {}

export const FlatListWithOverlay = React.forwardRef(
  (props: FlatListWithOverlayProps<any>, ref: any) => {
    const {
      horizontal,
      overlayThemeColor = 'backgroundColor',
      ...restProps
    } = props

    return (
      <ScrollViewWithOverlay
        ref={ref}
        {...restProps}
        ScrollViewComponent={FlatList}
      />
    )
  },
)
