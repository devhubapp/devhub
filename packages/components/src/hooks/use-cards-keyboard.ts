import {
  Column,
  EnhancedItem,
  getDefaultPaginationPerPage,
  isItemRead,
  isItemSaved,
} from '@devhub/core'
import { RefObject, useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

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
    getItemByNodeIdOrId,
    getOwnerIsKnownByItemOrNodeIdOrId,
    itemNodeIdOrIds,
    repoIsKnown,
    type,
    visibleItemIndexesRef,
  }: {
    columnId: string
    getItemByNodeIdOrId: (nodeIdOrId: string) => ItemT | undefined
    getOwnerIsKnownByItemOrNodeIdOrId: (
      itemOrNodeIdOrId: string | ItemT | undefined,
    ) => boolean
    itemNodeIdOrIds: string[]
    repoIsKnown: boolean
    type: Column['type']
    visibleItemIndexesRef?: RefObject<{ from: number; to: number }> | undefined
  },
) {
  const isColumnFocusedRef = useRef(getCurrentFocusedColumnId() === columnId)
  const selectedItemNodeIdOrIdRef = useRef<string | null | undefined>(undefined)
  const selectedItemIndexRef = useRef<number>(-1)
  selectedItemIndexRef.current = itemNodeIdOrIds.findIndex(
    (id) => !!(id && id === selectedItemNodeIdOrIdRef.current),
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
    (payload) => {
      if (!(listRef && listRef.current)) return
      if (columnId !== payload.columnId) {
        isColumnFocusedRef.current = false
        return
      }

      const index = payload.focusOnVisibleItem
        ? getFirstVisibleItemIndexOrSelected(-1)
        : -1
      const newIndex = Math.max(-1, Math.min(index, itemNodeIdOrIds.length - 1))
      const itemNodeIdOrId =
        newIndex >= 0 ? itemNodeIdOrIds[newIndex] : undefined

      const newValue = itemNodeIdOrId || null
      selectedItemNodeIdOrIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      isColumnFocusedRef.current = true

      if (payload.focusOnVisibleItem) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemNodeIdOrId: selectedItemNodeIdOrIdRef.current,
        })
      }
    },
    [columnId, itemNodeIdOrIds],
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    (payload) => {
      if (columnId !== payload.columnId) return

      selectedItemNodeIdOrIdRef.current = payload.itemNodeIdOrId
      selectedItemIndexRef.current = itemNodeIdOrIds.findIndex(
        (id) => !!(id && id === selectedItemNodeIdOrIdRef.current),
      )

      if (
        payload.scrollTo &&
        listRef.current &&
        selectedItemIndexRef.current >= 0
      )
        listRef.current.scrollToIndex(selectedItemIndexRef.current)
    },
    [columnId, itemNodeIdOrIds],
  )

  const firstItemNodeIdOrId = itemNodeIdOrIds && itemNodeIdOrIds[0]
  useEmitter(
    'SCROLL_TOP_COLUMN',
    (payload) => {
      if (payload.columnId !== columnId) return

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemNodeIdOrId: firstItemNodeIdOrId || null,
        scrollTo: false,
      })

      if (listRef.current) {
        listRef.current.scrollToStart()
      }
    },
    [columnId, firstItemNodeIdOrId],
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
              Math.min(
                selectedItemIndexRef.current - 1,
                itemNodeIdOrIds.length - 1,
              ),
            )
          : getFirstVisibleItemIndex()
      const itemNodeIdOrId = itemNodeIdOrIds[newIndex]

      const newValue = itemNodeIdOrId || null
      if (selectedItemNodeIdOrIdRef.current === newValue) {
        if (newIndex === 0) listRef.current.scrollToStart()
        return
      }
      selectedItemNodeIdOrIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemNodeIdOrId: selectedItemNodeIdOrIdRef.current,
        scrollTo: true,
      })
    },
    [columnId, itemNodeIdOrIds],
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
              Math.min(
                selectedItemIndexRef.current + 1,
                itemNodeIdOrIds.length - 1,
              ),
            )
          : getFirstVisibleItemIndex()
      const itemNodeIdOrId = itemNodeIdOrIds[newIndex]

      const newValue = itemNodeIdOrId || null
      if (selectedItemNodeIdOrIdRef.current === newValue) {
        if (newIndex >= itemNodeIdOrIds.length - 1)
          listRef.current.scrollToEnd()
        return
      }

      selectedItemNodeIdOrIdRef.current = newValue
      selectedItemIndexRef.current = newValue ? newIndex : -1

      listRef.current.scrollToIndex(newIndex)

      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemNodeIdOrId: selectedItemNodeIdOrIdRef.current!,
      })
    },
    [columnId, itemNodeIdOrIds],
  )

  useKeyPressCallback(
    'Escape',
    useCallback(() => {
      if (!(listRef && listRef.current)) return
      if (!isColumnFocusedRef.current) return
      if (selectedItemNodeIdOrIdRef.current === null) return

      selectedItemNodeIdOrIdRef.current = null
      selectedItemIndexRef.current = -1
      emitter.emit('FOCUS_ON_COLUMN_ITEM', {
        columnId,
        itemNodeIdOrId: null,
      })
    }, []),
  )

  useKeyPressCallback(
    'Enter',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemNodeIdOrId =
        !!selectedItemNodeIdOrIdRef.current &&
        itemNodeIdOrIds.find(
          (id) => id && id === selectedItemNodeIdOrIdRef.current,
        )
      if (!selectedItemNodeIdOrId) return

      const selectedItem = getItemByNodeIdOrId(selectedItemNodeIdOrId)
      if (!selectedItem) return

      dispatch(
        actions.openItem({
          columnType: type,
          columnId,
          itemNodeIdOrId: selectedItemNodeIdOrId,
          link: getCardPropsForItem(type, columnId, selectedItem, {
            ownerIsKnown: getOwnerIsKnownByItemOrNodeIdOrId(selectedItem),
            plan,
            repoIsKnown,
          }).link,
        }),
      )
    }, [
      columnId,
      getItemByNodeIdOrId,
      getOwnerIsKnownByItemOrNodeIdOrId,
      itemNodeIdOrIds,
      plan,
      repoIsKnown,
      type,
    ]),
  )

  useKeyPressCallback(
    's',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemNodeIdOrId =
        !!selectedItemNodeIdOrIdRef.current &&
        itemNodeIdOrIds.find(
          (id) => id && id === selectedItemNodeIdOrIdRef.current,
        )
      if (!selectedItemNodeIdOrId) return

      const selectedItem = getItemByNodeIdOrId(selectedItemNodeIdOrId)
      if (!selectedItem) return

      dispatch(
        actions.saveItemsForLater({
          itemNodeIdOrIds: [selectedItemNodeIdOrIdRef.current!],
          save: !isItemSaved(selectedItem),
        }),
      )
    }, [getItemByNodeIdOrId, itemNodeIdOrIds]),
  )

  useKeyPressCallback(
    'r',
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const selectedItemNodeIdOrId =
        !!selectedItemNodeIdOrIdRef.current &&
        itemNodeIdOrIds.find(
          (id) => id && id === selectedItemNodeIdOrIdRef.current,
        )
      if (!selectedItemNodeIdOrId) return

      const selectedItem = getItemByNodeIdOrId(selectedItemNodeIdOrId)
      if (!selectedItem) return

      dispatch(
        actions.markItemsAsReadOrUnread({
          type,
          itemNodeIdOrIds: [selectedItemNodeIdOrIdRef.current!],
          unread: isItemRead(selectedItem),
        }),
      )
    }, [getItemByNodeIdOrId, itemNodeIdOrIds]),
  )

  useMultiKeyPressCallback(
    ['Shift', 'r'],
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const hasOneUnreadItem = itemNodeIdOrIds.some((nodeIdOrId) => {
        const item = getItemByNodeIdOrId(nodeIdOrId)
        if (!item) return

        return !isItemRead(item)
      })

      dispatch(
        actions.markItemsAsReadOrUnread({
          type,
          itemNodeIdOrIds,
          unread: !hasOneUnreadItem,
        }),
      )
    }, [getItemByNodeIdOrId, itemNodeIdOrIds]),
  )

  useMultiKeyPressCallback(
    ['Shift', 'd'],
    useCallback(() => {
      if (!isColumnFocusedRef.current) return

      const hasItemsToMarkAsDone = itemNodeIdOrIds.some((nodeIdOrId) => {
        const item = getItemByNodeIdOrId(nodeIdOrId)
        return !!(item && !isItemSaved(item)) /* && isItemRead(item) */
      })

      dispatch(
        actions.setColumnClearedAtFilter({
          columnId,
          clearedAt: hasItemsToMarkAsDone ? new Date().toISOString() : null,
        }),
      )

      if (!hasItemsToMarkAsDone) {
        dispatch(
          actions.fetchColumnSubscriptionRequest({
            columnId,
            params: {
              page: 1,
              perPage: getDefaultPaginationPerPage(type),
            },
            replaceAllItems: false,
          }),
        )
      }
    }, [getItemByNodeIdOrId, itemNodeIdOrIds, type]),
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
        itemNodeIdOrIds.length - 1,
      )

      listRef.current.scrollToIndex(scrollToIndex, { alignment: 'start' })

      if (itemNodeIdOrIds[scrollToIndex]) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemNodeIdOrId: itemNodeIdOrIds[scrollToIndex],
          scrollTo: false,
        })
      }
    }, [itemNodeIdOrIds]),
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

      if (itemNodeIdOrIds[scrollToIndex]) {
        emitter.emit('FOCUS_ON_COLUMN_ITEM', {
          columnId,
          itemNodeIdOrId: itemNodeIdOrIds[scrollToIndex],
          scrollTo: false,
        })
      }
    }, [itemNodeIdOrIds]),
  )
}
