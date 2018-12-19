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
import { bugsnag } from '../../libs/bugsnag'
import { Separator, separatorSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
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

  const { sizename } = useAppLayout()
  const columnWidth = useColumnWidth()
  const flatListRef = useRef<FlatList<string>>(null)

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
      bounces={!swipeable}
      className="snap-container"
      data={columnIds}
      getItemLayout={(_data, index) => ({
        index,
        length: columnWidth + separatorSize,
        offset: index * (columnWidth + separatorSize),
      })}
      horizontal
      initialNumToRender={5}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={5}
      onScrollToIndexFailed={e => {
        console.error(e)
        bugsnag.notify({
          name: 'ScrollToIndexFailed',
          message: 'Failed to scroll to index',
          ...e,
        })
      }}
      pagingEnabled={pagingEnabled}
      removeClippedSubviews
      scrollEnabled={!swipeable}
      {...otherProps}
      renderItem={renderItem}
      style={[styles.flatlist, style]}
    />
  )
})
