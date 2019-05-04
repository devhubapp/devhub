import { RefObject, useCallback, useEffect, useRef } from 'react'

import { FlatList } from '../libs/flatlist'
import { useEmitter } from './use-emitter'
import { useForceRerender } from './use-force-rerender'
import useKeyPressCallback from './use-key-press-callback'

export function useKeyboardScrolling(
  ref: RefObject<FlatList<any>>,
  {
    columnId,
    getVisibleItemIndex,
    items,
  }: {
    columnId: string
    getVisibleItemIndex?: () => number | undefined
    items: Array<{ [key: string]: any; id: string | number } | undefined>
  },
) {
  function getFirstId(_items: typeof items) {
    return _items && _items[0] && _items[0]!.id
  }

  const forceRerender = useForceRerender()

  const selectedItemIdRef = useRef<string | number | null | undefined>(
    getFirstId(items),
  )

  // focus on first item by default
  useEffect(() => {
    if (selectedItemIdRef.current === undefined && getFirstId(items)) {
      selectedItemIdRef.current = items[0]!.id
      forceRerender()
    }
  }, [selectedItemIdRef.current, getFirstId(items)])

  useKeyPressCallback(
    'Escape',
    useCallback(() => {
      if (!(ref && ref.current)) return
      if (selectedItemIdRef.current === null) return

      selectedItemIdRef.current = null
      forceRerender()
    }, [ref && ref.current]),
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return

      const selectedIndex = items.findIndex(
        i => !!(i && i.id === selectedItemIdRef.current),
      )
      const newIndex = !selectedItemIdRef.current
        ? (getVisibleItemIndex && getVisibleItemIndex()) || 0
        : Math.max(0, Math.min(selectedIndex - 1, items.length - 1))
      const item = items[newIndex]

      ref.current.scrollToItem({
        animated: false,
        item,
        viewPosition: 0.5,
      })

      const newValue = (item && item.id) || getFirstId(items)
      if (selectedItemIdRef.current === newValue) return

      selectedItemIdRef.current = newValue
      forceRerender()
    },
    [ref && ref.current, columnId, items, getVisibleItemIndex],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload: { columnId: string }) => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return

      const selectedIndex = items.findIndex(
        i => !!(i && i.id === selectedItemIdRef.current),
      )
      const newIndex = !selectedItemIdRef.current
        ? (getVisibleItemIndex && getVisibleItemIndex()) || 0
        : Math.max(0, Math.min(selectedIndex + 1, items.length - 1))
      const item = items[newIndex]

      ref.current.scrollToItem({
        animated: false,
        item,
        viewPosition: 0.5,
      })

      const newValue = (item && item.id) || getFirstId(items)
      if (selectedItemIdRef.current === newValue) return

      selectedItemIdRef.current = newValue
      forceRerender()
    },
    [ref && ref.current, columnId, getVisibleItemIndex, items],
  )

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!ref.current) return
      if (columnId !== payload.columnId) return
      if (!getVisibleItemIndex) return

      const index = payload.focusOnVisibleItem ? getVisibleItemIndex() || 0 : -1
      const newIndex = Math.max(-1, Math.min(index, items.length - 1))
      const item = items[newIndex]

      const newValue = (item && item.id) || getFirstId(items)
      if (selectedItemIdRef.current === newValue) return

      selectedItemIdRef.current = newValue
      forceRerender()
    },
    [ref && ref.current, columnId, getVisibleItemIndex, items],
  )

  return { selectedItemId: selectedItemIdRef.current, selectedItemIdRef }
}
