import { RefObject, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { Column, EnhancedItem, isItemRead } from '@devhub/core'
import { getCardPropsForItem } from '../components/cards/BaseCard.shared'
import { getCurrentFocusedColumnId } from '../components/context/ColumnFocusContext'
import { emitter } from '../libs/emitter'
import { OneList } from '../libs/one-list'
import * as actions from '../redux/actions'
import * as selectors from '../redux/selectors'
import { useEmitter } from './use-emitter'
import useKeyPressCallback from './use-key-press-callback'
import useMultiKeyPressCallback from './use-multi-key-press-callback'
import { useReduxState } from './use-redux-state'

export function useCardsKeyboard<ItemT extends EnhancedItem>(
  listRef: RefObject<typeof OneList>,
  {
    columnId,
    getItemById,
    itemIds,
    ownerIsKnown,
    repoIsKnown,
    type,
    visibleItemIndexesRef,
  }: {
    columnId: string
    getItemById: (id: ItemT['id']) => ItemT | undefined
    itemIds: Array<ItemT['id'] | undefined>
    ownerIsKnown: boolean
    repoIsKnown: boolean
    type: Column['type']
    visibleItemIndexesRef?: RefObject<{ from: number; to: number }> | undefined
  },
) {
  const isColumnFocusedRef = useRef(getCurrentFocusedColumnId() === columnId)
  const selectedItemIdRef = useRef<string | number | null | undefined>(
    undefined,
  )
  const selectedItemIndexRef = useRef<number>(-1)
  selectedItemIndexRef.current = itemIds.findIndex(
    id => !!(id && id === selectedItemIdRef.current),
  )

  const hasVisibleItems = () =>
    visibleItemIndexesRef &&
    visibleItemIndexesRef.current &&
    typeof visibleItemIndexesRef.current.from === 'number' &&
    typeof visibleItemIndexesRef.current.to === 'number' &&
    visibleItemIndexesRef.current.from >= 0 &&
    visibleItemIndexesRef.current.to >= visibleItemIndexesRef.current.from

  const getFirstVisibleItemIndex = (fallbackValue = 0) =>
    hasVisibleItems() ? visibleItemIndexesRef!.current!.from : fallbackValue

  const getFirstVisibleItemIndexOrSelected = (fallbackValue = 0) => {
    if (
      typeof selectedItemIndexRef.current === 'number' &&
      selectedItemIndexRef.current >= 0
    ) {
      if (
        hasVisibleItems() &&
        selectedItemIndexRef.current >= visibleItemIndexesRef!.current!.from &&
        selectedItemIndexRef.current <= visibleItemIndexesRef!.current!.to
      ) {
        return selectedItemIndexRef.current
      }
    }

    return getFirstVisibleItemIndex(fallbackValue)
  }

  const dispatch = useDispatch()

  const plan = useReduxState(selectors.currentUserPlanSelector)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) {
        isColumnFocusedRef.current = false
        return
      }

      const index = payload.focusOnVisibleItem
        ? getFirstVisibleItemIndexOrSelected(-1)
        : -1
      const newIndex = Math.max(-1, Math.min(index, itemIds.length - 1))
      const itemId = newIndex >= 0 ? itemIds[newIndex] : undefined

      const newValue = itemId || null
      selectedItemIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      isColumnFocusedRef.current = true

      if (payload.focusOnVisibleItem) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemId: selectedItemIdRef.current,
        })
      }
    },
    [columnId, itemIds],
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      if (columnId !== payload.columnId) return

      selectedItemIdRef.current = payload.itemId
      selectedItemIndexRef.current = itemIds.findIndex(
        id => !!(id && id === selectedItemIdRef.current),
      )

      if (
        payload.scrollTo &&
        listRef.current &&
        selectedItemIndexRef.current >= 0
      )
        listRef.current.scrollToIndex(selectedItemIndexRef.current)
    },
    [columnId, itemIds],
  )

  const firstItemId = itemIds && itemIds[0]
  useEmitter(
    'SCROLL_TOP_COLUMN',
    payload => {
      if (payload.columnId !== columnId) return

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: firstItemId || null,
        scrollTo: true,
      })

      if (!firstItemId && listRef.current) {
        listRef.current.scrollToStart()
      }
    },
    [columnId, firstItemId],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload: { columnId: string }) => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) return

      const newIndex =
        selectedItemIndexRef.current >= 0
          ? Math.max(
              0,
              Math.min(selectedItemIndexRef.current - 1, itemIds.length - 1),
            )
          : getFirstVisibleItemIndex()
      const itemId = itemIds[newIndex]

      const newValue = itemId || null
      if (selectedItemIdRef.current === newValue) {
        if (newIndex === 0) listRef.current.scrollToStart()
        return
      }
      selectedItemIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current,
        scrollTo: true,
      })
    },
    [columnId, itemIds],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload: { columnId: string }) => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) return

      const newIndex =
        selectedItemIndexRef.current >= 0
          ? Math.max(
              0,
              Math.min(selectedItemIndexRef.current + 1, itemIds.length - 1),
            )
          : getFirstVisibleItemIndex()
      const itemId = itemIds[newIndex]

      const newValue = itemId || null
      if (selectedItemIdRef.current === newValue) {
        if (newIndex === itemIds.length - 1) listRef.current.scrollToEnd()
        return
      }

      selectedItemIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      listRef.current.scrollToIndex(newIndex)

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: selectedItemIdRef.current!,
      })
    },
    [columnId, itemIds],
  )

  useKeyPressCallback(
    'Escape',
    useCallback(() => {
      if (!(listRef && listRef.current)) return
      if (!isColumnFocusedRef.current) return
      if (selectedItemIdRef.current === null) return

      selectedItemIdRef.current = null
      selectedItemIndexRef.current = -1
      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemId: null,
      })
    }, []),
  )

  useKeyPressCallback(
    'Enter',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemId =
        !!selectedItemIdRef.current &&
        itemIds.find(id => id && id === selectedItemIdRef.current)
      if (!selectedItemId) return

      const selectedItem = getItemById(selectedItemId)
      if (!selectedItem) return

      dispatch(
        actions.openItem({
          columnType: type,
          columnId,
          itemId: selectedItemId,
          link: getCardPropsForItem(type, selectedItem, {
            ownerIsKnown,
            plan,
            repoIsKnown,
          }).link,
        }),
      )
    }, [columnId, getItemById, itemIds, ownerIsKnown, plan, repoIsKnown, type]),
  )

  useKeyPressCallback(
    's',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemId =
        !!selectedItemIdRef.current &&
        itemIds.find(id => id && id === selectedItemIdRef.current)
      if (!selectedItemId) return

      const selectedItem = getItemById(selectedItemId)
      if (!selectedItem) return

      dispatch(
        actions.saveItemsForLater({
          itemIds: [selectedItemIdRef.current!],
          save: !selectedItem.saved,
        }),
      )
    }, [getItemById, itemIds]),
  )

  useKeyPressCallback(
    'r',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemId =
        !!selectedItemIdRef.current &&
        itemIds.find(id => id && id === selectedItemIdRef.current)
      if (!selectedItemId) return

      const selectedItem = getItemById(selectedItemId)
      if (!selectedItem) return

      dispatch(
        actions.markItemsAsReadOrUnread({
          type,
          itemIds: [selectedItemIdRef.current!],
          unread: isItemRead(selectedItem),
        }),
      )
    }, [getItemById, itemIds]),
  )

  useKeyPressCallback(
    ' ',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return
      if (!(listRef && listRef.current)) return

      if (!hasVisibleItems()) {
        listRef.current.scrollToStart()
        return
      }

      const visibleItemsCount =
        visibleItemIndexesRef!.current!.to -
        visibleItemIndexesRef!.current!.from +
        1

      const scrollToIndex = Math.min(
        visibleItemIndexesRef!.current!.to + visibleItemsCount,
        itemIds.length - 1,
      )

      listRef.current.scrollToIndex(scrollToIndex, { alignment: 'start' })

      if (itemIds[scrollToIndex]) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemId: itemIds[scrollToIndex],
          scrollTo: false,
        })
      }
    }, [itemIds]),
  )

  useMultiKeyPressCallback(
    ['Shift', ' '],
    useCallback(() => {
      if (!isColumnFocusedRef.current) return
      if (!(listRef && listRef.current)) return

      if (!hasVisibleItems()) {
        listRef.current.scrollToStart()
        return
      }

      const visibleItemsCount =
        visibleItemIndexesRef!.current!.to -
        visibleItemIndexesRef!.current!.from +
        1

      const scrollToIndex = Math.max(
        0,
        visibleItemIndexesRef!.current!.from - visibleItemsCount,
      )
      listRef.current.scrollToIndex(scrollToIndex, { alignment: 'start' })

      if (itemIds[scrollToIndex]) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemId: itemIds[scrollToIndex],
          scrollTo: false,
        })
      }
    }, [itemIds]),
  )
}
