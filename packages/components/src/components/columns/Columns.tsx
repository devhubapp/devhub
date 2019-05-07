import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'

import { constants, Omit } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxState } from '../../hooks/use-redux-state'
import { bugsnag } from '../../libs/bugsnag'
import { FlatList, FlatListProps } from '../../libs/flatlist'
import { Platform } from '../../libs/platform'
import * as selectors from '../../redux/selectors'
import { separatorThickSize } from '../common/Separator'
import { useFocusedColumn } from '../context/ColumnFocusContext'
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
  const { pointerEvents, style, ...otherProps } = props

  const { sizename } = useAppLayout()
  const columnWidth = useColumnWidth()
  const { focusedColumnId, focusedColumnIndex } = useFocusedColumn()

  const columnIds = useReduxState(selectors.columnIdsSelector)
  const currentOpenedModal = useReduxState(selectors.currentOpenedModal)

  const currentOpenedModalRef = useRef(false)
  currentOpenedModalRef.current = !!currentOpenedModal

  const flatListRef = useRef<FlatList<string>>(null)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!flatListRef.current) return
      if (!(columnIds && columnIds.length)) return
      if (!payload.columnId) return

      if (payload.scrollTo) {
        flatListRef.current.scrollToItem({
          animated: payload.animated,
          item: payload.columnId,
          viewPosition: 0.5,
        })
      }
    },
    [flatListRef, columnIds],
  )

  useEffect(() => {
    if (!flatListRef.current) return
    if (!(focusedColumnId && focusedColumnIndex >= 0)) return
    if (sizename !== '1-small') return

    flatListRef.current.scrollToItem({
      animated: true,
      item: focusedColumnId,
      viewPosition: 0.5,
    })
  }, [
    flatListRef.current,
    columnIds,
    focusedColumnId,
    focusedColumnIndex,
    sizename,
  ])

  const pagingEnabled = sizename < '3-large'
  const swipeable = constants.DISABLE_SWIPEABLE_CARDS
    ? false
    : sizename === '1-small'

  const renderItem: FlatListProps<string>['renderItem'] = useCallback(
    ({ item: columnId }) => {
      return (
        <ColumnContainer
          columnId={columnId}
          pagingEnabled={pagingEnabled}
          pointerEvents={pointerEvents}
          swipeable={swipeable}
        />
      )
    },
    [pagingEnabled, pointerEvents, swipeable],
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

  /*
  const _onViewableItemsChanged: FlatListProps<
    string
  >['onViewableItemsChanged'] = info => {
    if (currentOpenedModalRef.current) return

    const allVisibleItems =
      info &&
      info.viewableItems &&
      info.viewableItems.filter(item => item.isViewable)

    if (!(allVisibleItems && allVisibleItems.length === 1)) return

    emitter.emit('FOCUS_ON_COLUMN', {
      animated: false,
      columnId: allVisibleItems[0].item,
      focusOnVisibleItem: false,
      highlight: false,
      scrollTo: false,
    })
  }

  const _debouncedOnViewableItemsChanged = _.debounce(
    _onViewableItemsChanged,
    800,
  )

  const onViewableItemsChanged = useCallback(
    _debouncedOnViewableItemsChanged,
    [],
  )
  */

  return (
    <FlatList
      ref={flatListRef}
      key="columns-flat-list"
      className="pagingEnabledFix"
      bounces={!swipeable}
      data={columnIds}
      disableVirtualization={Platform.OS === 'web'}
      getItemLayout={getItemLayout}
      horizontal
      initialNumToRender={4}
      keyExtractor={keyExtractor}
      maxToRenderPerBatch={1}
      onScrollToIndexFailed={onScrollToIndexFailed}
      // onViewableItemsChanged={onViewableItemsChanged}
      pagingEnabled={pagingEnabled}
      pointerEvents={pointerEvents}
      removeClippedSubviews={Platform.OS !== 'web'}
      scrollEnabled={!swipeable}
      windowSize={2}
      {...otherProps}
      renderItem={renderItem}
      style={flatListStyle}
    />
  )
})
