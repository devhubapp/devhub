import _ from 'lodash'
import React, { useCallback, useMemo, useRef } from 'react'
import { StyleProp, ViewStyle } from 'react-native'

import { constants } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useEmitter } from '../../hooks/use-emitter'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import { OneList, OneListProps } from '../../libs/one-list'
import { useSafeArea } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { useColumnWidth } from '../context/ColumnWidthContext'
import { useAppLayout } from '../context/LayoutContext'

export interface ColumnsProps
  extends Pick<OneListProps<string>, 'pointerEvents'> {
  contentContainerStyle?: StyleProp<ViewStyle>
}

function keyExtractor(columnId: string) {
  return `column-container-${columnId}`
}

export const Columns = React.memo((props: ColumnsProps) => {
  const { pointerEvents } = props

  const listRef = useRef<typeof OneList>(null)
  const { appOrientation, sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const appSafeAreaInsets = useSafeArea()
  const columnWidth = useColumnWidth()
  const columnIds = useReduxState(selectors.columnIdsSelector)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!listRef.current) return
      if (!(columnIds && columnIds.length)) return
      if (!payload.columnId) return

      if (payload.scrollTo) {
        listRef.current.scrollToIndex(columnIds.indexOf(payload.columnId), {
          // animated: payload.animated,
          alignment: 'smart',
        })
      }
    },
    [columnIds],
  )

  const pagingEnabled = sizename < '3-large'
  const swipeable = constants.DISABLE_SWIPEABLE_CARDS
    ? false
    : appViewMode === 'single-column'

  const renderItem: OneListProps<string>['renderItem'] = useCallback(
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

  const getItemSize = useCallback<
    NonNullable<OneListProps<string>['getItemSize']>
  >(() => columnWidth, [columnWidth])

  const onVisibleItemsChanged = useCallback<
    NonNullable<OneListProps<string>['onVisibleItemsChanged']>
  >(
    (fromIndex, toIndex) => {
      if (appViewMode !== 'single-column') return

      if (!(fromIndex >= 0 && fromIndex === toIndex)) return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: columnIds[fromIndex],
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [appViewMode],
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
      estimatedItemSize={getItemSize(columnIds[0], 0) || columnWidth}
      getItemKey={keyExtractor}
      getItemSize={getItemSize}
      horizontal
      onVisibleItemsChanged={debouncedOnVisibleItemsChanged}
      overscanCount={3}
      pointerEvents={pointerEvents}
      renderItem={renderItem}
      safeAreaInsets={safeAreaInsets}
    />
  )
})

Columns.displayName = 'Columns'
