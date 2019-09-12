import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { constants } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter, EmitterTypes } from '../../libs/emitter'
import { OneList, OneListProps } from '../../libs/one-list'
import { Platform } from '../../libs/platform'
import { useSafeArea } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'
import { NoColumns } from './NoColumns'

export interface ColumnsProps {
  contentContainerStyle?: StyleProp<ViewStyle>
}

function keyExtractor(columnId: string) {
  return `column-container-${columnId}`
}

export const Columns = React.memo((props: ColumnsProps) => {
  const listRef = useRef<typeof OneList>(null)
  const appSafeAreaInsets = useSafeArea()
  const columnIds = useReduxState(selectors.columnIdsSelector)
  const columnWidth = useColumnWidth()
  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const useFailedColumnFocusRef = useRef({
    payload: null as EmitterTypes['FOCUS_ON_COLUMN'] | null,
    lastTriedAt: null as number | null,
  })

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!listRef.current) return
      if (!(columnIds && columnIds.length)) return
      if (!payload.columnId) return

      if (!payload.scrollTo) return

      const index = columnIds.indexOf(payload.columnId)
      if (!(index >= 0)) {
        useFailedColumnFocusRef.current = { payload, lastTriedAt: Date.now() }
        return
      }
      useFailedColumnFocusRef.current = { payload: null, lastTriedAt: null }

      listRef.current.scrollToIndex(index, {
        animated: payload.animated,
        alignment: 'smart',
      })
    },
    [columnIds],
  )

  useEffect(() => {
    if (!listRef.current) return
    if (!(columnIds && columnIds.length)) return
    if (
      !(
        useFailedColumnFocusRef.current.payload &&
        useFailedColumnFocusRef.current.payload.columnId &&
        useFailedColumnFocusRef.current.lastTriedAt &&
        Date.now() - useFailedColumnFocusRef.current.lastTriedAt <= 10000
      )
    )
      return

    const index = columnIds.indexOf(
      useFailedColumnFocusRef.current.payload.columnId,
    )
    if (!(index >= 0)) return

    emitter.emit('FOCUS_ON_COLUMN', useFailedColumnFocusRef.current.payload)
  }, [columnIds.join(',')])

  const pagingEnabled = appViewMode === 'single-column'

  const swipeable =
    !constants.DISABLE_SWIPEABLE_CARDS &&
    (Platform.OS === 'ios' || Platform.OS === 'android')

  const renderItem: OneListProps<string>['renderItem'] = useCallback(
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

  const getItemSize = useCallback<
    NonNullable<OneListProps<string>['getItemSize']>
  >(() => columnWidth, [columnWidth])

  const onVisibleItemsChanged = useCallback<
    NonNullable<OneListProps<string>['onVisibleItemsChanged']>
  >(
    (fromIndex, toIndex) => {
      if (appViewMode !== 'single-column') return
      if (!(fromIndex >= 0 && fromIndex === toIndex)) return
      if (columnIds[fromIndex] === focusedColumnId) return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: columnIds[fromIndex],
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [appViewMode, columnIds.join(','), focusedColumnId],
  )

  const debouncedOnVisibleItemsChanged = useMemo(
    () => _.debounce(onVisibleItemsChanged, 800),
    [onVisibleItemsChanged],
  )

  const safeAreaInsets: OneListProps<string>['safeAreaInsets'] = useMemo(
    () => ({
      left: appOrientation === 'landscape' ? 0 : appSafeAreaInsets.left,
      right: appSafeAreaInsets.right,
    }),
    [appOrientation, appSafeAreaInsets.right],
  )

  return (
    <OneList
      ref={listRef}
      key="columns-list"
      data={columnIds}
      disableVirtualization={Platform.OS === 'web'}
      ListEmptyComponent={NoColumns}
      estimatedItemSize={columnWidth}
      getItemKey={keyExtractor}
      getItemSize={getItemSize}
      horizontal
      onVisibleItemsChanged={debouncedOnVisibleItemsChanged}
      overscanCount={1}
      pagingEnabled={pagingEnabled}
      renderItem={renderItem}
      safeAreaInsets={safeAreaInsets}
    />
  )
})

Columns.displayName = 'Columns'
