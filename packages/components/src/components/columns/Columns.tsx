import React, { useRef } from 'react'
import {
  FlatList,
  FlatListProps,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native'

import { Omit } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useEmitter } from '../../hooks/use-emitter'
import { Separator } from '../common/Separator'
import { useAppLayout } from '../context/LayoutContext'

export interface ColumnsProps
  extends Omit<FlatListProps<string>, 'data' | 'renderItem'> {
  contentContainerStyle?: StyleProp<ViewStyle>
  columnIds: string[]
  style?: StyleProp<ViewStyle>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  flatlist: {
    flex: 1,
  },
})

function keyExtractor(columnId: string) {
  return `column-container-${columnId}`
}

export const Columns = React.memo((props: ColumnsProps) => {
  const { columnIds, style, ...otherProps } = props

  const flatListRef = useRef<FlatList<string>>(null)
  const { sizename } = useAppLayout()

  useEmitter(
    'FOCUS_ON_COLUMN',
    (payload: {
      columnId: string
      columnIndex: number
      animated?: boolean
      highlight?: boolean
    }) => {
      if (!flatListRef.current) return
      if (!(columnIds && columnIds.length)) return

      if (payload.columnIndex >= 0 && payload.columnIndex < columnIds.length) {
        flatListRef.current!.scrollToIndex({
          animated: payload.animated,
          index: payload.columnIndex,
        })
      }
    },
    [flatListRef, columnIds],
  )

  const renderItem: FlatListProps<string>['renderItem'] = ({
    item: columnId,
  }) => {
    return (
      <ColumnContainer
        columnId={columnId}
        pagingEnabled={pagingEnabled}
        swipeable={swipeable}
      />
    )
  }

  const pagingEnabled = sizename === '1-small'
  const swipeable: boolean = false

  return (
    <FlatList
      ref={flatListRef}
      key="columns-flat-list"
      ItemSeparatorComponent={Separator}
      ListFooterComponent={
        sizename === '1-small' || (columnIds && columnIds.length)
          ? Separator
          : undefined
      }
      ListHeaderComponent={sizename === '1-small' ? Separator : undefined}
      bounces={!swipeable}
      className="snap-container"
      data={columnIds}
      horizontal
      initialNumToRender={5}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={5}
      onScrollToIndexFailed={() => undefined}
      pagingEnabled={pagingEnabled}
      removeClippedSubviews
      scrollEnabled={!swipeable}
      {...otherProps}
      renderItem={renderItem}
      style={[styles.flatlist, style]}
    />
  )
})
