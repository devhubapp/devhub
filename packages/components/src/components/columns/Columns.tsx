import { constants } from '@devhub/core'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useDynamicRef } from '../../hooks/use-dynamic-ref'
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

function getItemKey(columnId: string, _index: number) {
  return `column-container-${columnId}`
}

export const Columns = React.memo((props: ColumnsProps) => {
  const listRef = useRef<typeof OneList>(null)
  const appSafeAreaInsets = useSafeArea()
  const _columnIds = useReduxState(selectors.columnIdsSelector)
  const columnWidth = useColumnWidth()
  const { appOrientation } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const useFailedColumnFocusRef = useRef({
    payload: null as EmitterTypes['FOCUS_ON_COLUMN'] | null,
    lastTriedAt: null as number | null,
  })
  const focusedColumnIdRef = useDynamicRef(focusedColumnId)

  const columnIds = useMemo(
    () =>
      appViewMode === 'single-column'
        ? focusedColumnId
          ? [focusedColumnId]
          : []
        : _columnIds,
    [
      (appViewMode === 'single-column' ? [focusedColumnId] : _columnIds).join(
        ',',
      ),
    ],
  )

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
        alignment:
          index === 0
            ? 'start'
            : index >= columnIds.length - 1
            ? 'end'
            : 'smart',
      })
    },
    [columnIds],
  )

  useEffect(() => {
    if (!listRef.current) return
    if (!(columnIds && columnIds.length)) return

    const id =
      useFailedColumnFocusRef.current.payload &&
      useFailedColumnFocusRef.current.payload.columnId &&
      useFailedColumnFocusRef.current.lastTriedAt &&
      Date.now() - useFailedColumnFocusRef.current.lastTriedAt <= 10000
        ? useFailedColumnFocusRef.current.payload.columnId
        : focusedColumnIdRef.current

    const index = id ? columnIds.indexOf(id) : -1

    if (!(index >= 0)) return

    emitter.emit(
      'FOCUS_ON_COLUMN',
      useFailedColumnFocusRef.current.payload &&
        id === useFailedColumnFocusRef.current.payload.columnId
        ? useFailedColumnFocusRef.current.payload
        : {
            animated: true,
            columnId: id!,
            focusOnVisibleItem: true,
            highlight: false,
            scrollTo: true,
          },
    )
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

  if (appViewMode === 'single-column') {
    return renderItem({ index: 0, item: columnIds[0] })
  }

  return (
    <OneList
      ref={listRef}
      key="columns-list"
      data={columnIds}
      data-scrollbar
      disableVirtualization
      ListEmptyComponent={NoColumns}
      estimatedItemSize={columnWidth}
      getItemKey={getItemKey}
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
