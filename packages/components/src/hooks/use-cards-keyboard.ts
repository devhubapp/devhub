import { RefObject, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Column, EnhancedItem, isItemRead } from '@devhub/core'
import { emitter } from '../libs/emitter'
import { OneList } from '../libs/one-list'
import * as actions from '../redux/actions'
import { useEmitter } from './use-emitter'
import useKeyPressCallback from './use-key-press-callback'

export function useCardsKeyboard(
  listRef: RefObject<typeof OneList>,
  {
    columnId,
    firstVisibleItemIndexRef,
    items,
    type,
  }: {
    columnId: string
    firstVisibleItemIndexRef?: RefObject<number> | undefined
    items: Array<EnhancedItem | undefined>
    type: Column['type']
  },
) {
  const isColumnFocusedRef = useRef(false)
  const selectedItemIdRef = useRef<string | number | null | undefined>(
    undefined,
  )

  const getFirstVisibleItemIndex = (fallbackValue = 0) =>
    firstVisibleItemIndexRef &&
    typeof firstVisibleItemIndexRef.current === 'number' &&
    firstVisibleItemIndexRef.current >= 0
      ? firstVisibleItemIndexRef.current
      : fallbackValue

  const dispatch = useDispatch()

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) {
        isColumnFocusedRef.current = false
        return
      }

      const index = payload.focusOnVisibleItem
        ? getFirstVisibleItemIndex(-1)
        : -1
      const newIndex = Math.max(-1, Math.min(index, items.length - 1))
      const item = newIndex >= 0 ? items[newIndex] : undefined

      const newValue = (item && item.id) || null
      selectedItemIdRef.current = newValue

      if (isColumnFocusedRef.current && selectedItemIdRef.current === newValue)
        return

      isColumnFocusedRef.current = true

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current,
      })
    },
    [columnId, items],
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      if (columnId !== payload.columnId) return
      selectedItemIdRef.current = payload.itemId
    },
    [columnId],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload: { columnId: string }) => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) return

      const selectedIndex = items.findIndex(
        i => !!(i && i.id === selectedItemIdRef.current),
      )
      const newIndex = !selectedItemIdRef.current
        ? getFirstVisibleItemIndex()
        : Math.max(0, Math.min(selectedIndex - 1, items.length - 1))
      const item = items[newIndex]

      const newValue = (item && item.id) || null
      if (selectedItemIdRef.current === newValue) return
      selectedItemIdRef.current = newValue

      listRef.current.scrollToIndex(newIndex)

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current,
      })
    },
    [columnId, items],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload: { columnId: string }) => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) return

      const selectedIndex = items.findIndex(
        i => !!(i && i.id === selectedItemIdRef.current),
      )
      const newIndex = !selectedItemIdRef.current
        ? getFirstVisibleItemIndex()
        : Math.max(0, Math.min(selectedIndex + 1, items.length - 1))
      const item = items[newIndex]

      const newValue = (item && item.id) || null
      if (selectedItemIdRef.current === newValue) return
      selectedItemIdRef.current = newValue

      listRef.current.scrollToIndex(newIndex)

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current,
      })
    },
    [columnId, items],
  )

  useKeyPressCallback(
    'Escape',
    useCallback(() => {
      if (!(listRef && listRef.current)) return
      if (!isColumnFocusedRef.current) return
      if (selectedItemIdRef.current === null) return

      selectedItemIdRef.current = null
      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current,
      })
    }, []),
  )

  useKeyPressCallback(
    's',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItem =
        !!selectedItemIdRef.current &&
        items.find(item => item && item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      dispatch(
        actions.saveItemsForLater({
          itemIds: [selectedItemIdRef.current!],
          save: !selectedItem.saved,
        }),
      )
    }, [columnId, items]),
  )

  useKeyPressCallback(
    'r',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItem =
        !!selectedItemIdRef.current &&
        items.find(item => item && item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      dispatch(
        actions.markItemsAsReadOrUnread({
          type,
          itemIds: [selectedItemIdRef.current!],
          unread: isItemRead(selectedItem),
        }),
      )
    }, [columnId, items]),
  )
}
