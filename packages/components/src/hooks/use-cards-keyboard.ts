import { RefObject, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Column, EnhancedItem, isItemRead } from '@devhub/core'
import { OneList } from '../libs/one-list'
import * as actions from '../redux/actions'
import { useEmitter } from './use-emitter'
import { useForceRerender } from './use-force-rerender'
import useKeyPressCallback from './use-key-press-callback'

export function useCardsKeyboard(
  listRef: RefObject<typeof OneList>,
  {
    columnId,
    enabled: _enabled,
    firstVisibleItemIndexRef,
    items,
    type,
  }: {
    columnId: string
    enabled: boolean
    firstVisibleItemIndexRef?: RefObject<number> | undefined
    items: Array<EnhancedItem | undefined>
    type: Column['type']
  },
) {
  const selectedItemIdRef = useRef<string | number | null | undefined>(
    undefined,
  )

  const enabled = !!(_enabled && listRef && columnId)

  const getFirstVisibleItemIndex = (fallbackValue = 0) =>
    firstVisibleItemIndexRef &&
    typeof firstVisibleItemIndexRef.current === 'number' &&
    firstVisibleItemIndexRef.current >= 0
      ? firstVisibleItemIndexRef.current
      : fallbackValue

  const dispatch = useDispatch()
  const forceRerender = useForceRerender()

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) return

      const index = payload.focusOnVisibleItem
        ? getFirstVisibleItemIndex(-1)
        : -1
      const newIndex = Math.max(-1, Math.min(index, items.length - 1))
      if (!(newIndex >= 0)) return
      const item = items[newIndex]

      const newValue = (item && item.id) || null
      if (selectedItemIdRef.current === newValue) return
      selectedItemIdRef.current = newValue

      forceRerender()
    },
    [columnId, items],
  )

  useEmitter(
    enabled ? 'SCROLL_UP_COLUMN' : undefined,
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

      forceRerender()
    },
    [columnId, items],
  )

  useEmitter(
    enabled ? 'SCROLL_DOWN_COLUMN' : undefined,
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

      forceRerender()
    },
    [columnId, items],
  )

  useKeyPressCallback(
    enabled ? 'Escape' : undefined,
    useCallback(() => {
      if (!(listRef && listRef.current)) return
      if (selectedItemIdRef.current === null) return

      selectedItemIdRef.current = null
      forceRerender()
    }, []),
  )

  const hasSelectedItem = enabled && !!selectedItemIdRef.current

  useKeyPressCallback(
    enabled ? 's' : undefined,
    useCallback(() => {
      const selectedItem =
        hasSelectedItem &&
        items.find(item => item && item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      dispatch(
        actions.saveItemsForLater({
          itemIds: [selectedItemIdRef.current!],
          save: !selectedItem.saved,
        }),
      )
    }, [hasSelectedItem, items]),
  )

  useKeyPressCallback(
    enabled ? 'r' : undefined,
    useCallback(() => {
      const selectedItem =
        hasSelectedItem &&
        items.find(item => item && item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      dispatch(
        actions.markItemsAsReadOrUnread({
          type,
          itemIds: [selectedItemIdRef.current!],
          unread: isItemRead(selectedItem),
        }),
      )
    }, [hasSelectedItem, items]),
  )

  return { selectedItemId: selectedItemIdRef.current, selectedItemIdRef }
}
