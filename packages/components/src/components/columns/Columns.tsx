import React, { useCallback, useMemo, useRef } from 'react'
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
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import * as selectors from '../../redux/selectors'
import { separatorThickSize } from '../common/Separator'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'

export interface ColumnsProps
  extends Omit<FlatListProps<string>, 'data' | 'renderItem'> {
  contentContainerStyle?: StyleProp<ViewStyle>
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
  const { style, ...otherProps } = props

  const { sizename } = useAppLayout()
  const columnWidth = useColumnWidth()

  const columnIds = useReduxState(selectors.columnIdsSelector)

  const flatListRef = useRef<FlatList<string>>(null)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!flatListRef.current) return
      if (!(columnIds && columnIds.length)) return

      if (payload.columnIndex >= 0 && payload.columnIndex < columnIds.length) {
        if (payload.scrollTo) {
          flatListRef.current.scrollToIndex({
            animated: payload.animated,
            index: payload.columnIndex,
            viewPosition: 0.5,
          })
        }
      }
    },
    [flatListRef, columnIds],
  )

  const pagingEnabled = sizename < '3-large'
  const swipeable: boolean = false

  const renderItem: FlatListProps<string>['renderItem'] = useCallback(
    ({ item: columnId }) => {
      return (
        <ColumnContainer
          columnId={columnId}
          pagingEnabled={pagingEnabled}
          swipeable={swipeable}
        />
      )
    },
    [pagingEnabled, swipeable],
  )

  const getItemLayout: FlatListProps<string>['getItemLayout'] = useCallback(
    (_data, index) => ({
      index,
      length: columnWidth,
      offset: index * columnWidth,
    }),
    [columnWidth],
  )

  const _onScrollToIndexFailed: FlatListProps<
    string
  >['onScrollToIndexFailed'] = (info: {
    index: number
    highestMeasuredFrameIndex: number
    averageItemLength: number
  }) => {
    console.error(info)
    bugsnag.notify({
      name: 'ScrollToIndexFailed',
      message: 'Failed to scroll to index',
      ...info,
    })
  }
  const onScrollToIndexFailed: FlatListProps<
    string
  >['onScrollToIndexFailed'] = useCallback(_onScrollToIndexFailed, [])

  const flatListStyle = useMemo(
    () => [
      styles.flatlist,
      sizename > '1-small' && {
        marginHorizontal: -separatorThickSize / 2,
      },
      style,
    ],
    [style, sizename, separatorThickSize],
  )

  return (
    <FlatList
      ref={flatListRef}
      key="columns-flat-list"
      className="pagingEnabledFix"
      bounces={!swipeable}
      data={columnIds}
      getItemLayout={getItemLayout}
      horizontal
      initialNumToRender={4}
      keyExtractor={keyExtractor}
      onScrollToIndexFailed={onScrollToIndexFailed}
      pagingEnabled={pagingEnabled}
      removeClippedSubviews
      scrollEnabled={!swipeable}
      {...otherProps}
      renderItem={renderItem}
      style={flatListStyle}
    />
  )
})
