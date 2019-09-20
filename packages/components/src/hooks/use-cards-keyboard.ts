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

export function useCardsKeyboard(
  listRef: RefObject<typeof OneList>,
  {
    columnId,
    items,
    ownerIsKnown,
    repoIsKnown,
    type,
    visibleItemIndexesRef,
  }: {
    columnId: string
    items: Array<EnhancedItem | undefined>
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
  selectedItemIndexRef.current = items.findIndex(
    i => !!(i && i.id === selectedItemIdRef.current),
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
      const newIndex = Math.max(-1, Math.min(index, items.length - 1))
      const item = newIndex >= 0 ? items[newIndex] : undefined

      const newValue = (item && item.id) || null
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
    [columnId, items],
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      if (columnId !== payload.columnId) return

      selectedItemIdRef.current = payload.itemId
      selectedItemIndexRef.current = items.findIndex(
        i => !!(i && i.id === selectedItemIdRef.current),
      )

      if (
        payload.scrollTo &&
        listRef.current &&
        selectedItemIndexRef.current >= 0
      )
        listRef.current.scrollToIndex(selectedItemIndexRef.current)
    },
    [columnId, items],
  )

  const firstItemId = items && items[0] && items[0].id
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
              Math.min(selectedItemIndexRef.current - 1, items.length - 1),
            )
          : getFirstVisibleItemIndex()
      const item = items[newIndex]

      const newValue = (item && item.id) || null
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
    [columnId, items],
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
              Math.min(selectedItemIndexRef.current + 1, items.length - 1),
            )
          : getFirstVisibleItemIndex()
      const item = items[newIndex]

      const newValue = (item && item.id) || null
      if (selectedItemIdRef.current === newValue) {
        if (newIndex === items.length - 1) listRef.current.scrollToEnd()
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
    [columnId, items],
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

      const selectedItem =
        !!selectedItemIdRef.current &&
        items.find(item => item && item.id === selectedItemIdRef.current)
      if (!selectedItem) return

      dispatch(
        actions.openItem({
          columnType: type,
          columnId,
          itemId: selectedItem.id,
          link: getCardPropsForItem(type, selectedItem, {
            ownerIsKnown,
            plan,
            repoIsKnown,
          }).link,
        }),
      )
    }, [items, type, columnId, ownerIsKnown, plan, repoIsKnown]),
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
    }, [items]),
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
    }, [items]),
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
        items.length - 1,
      )

      listRef.current.scrollToIndex(scrollToIndex, { alignment: 'start' })

      if (items[scrollToIndex] && items[scrollToIndex]!.id) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemId: items[scrollToIndex]!.id,
          scrollTo: false,
        })
      }
    }, [items]),
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

      if (items[scrollToIndex] && items[scrollToIndex]!.id) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemId: items[scrollToIndex]!.id,
          scrollTo: false,
        })
      }
    }, [items]),
  )
}
