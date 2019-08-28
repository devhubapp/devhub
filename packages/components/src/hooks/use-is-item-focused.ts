import { useRef } from 'react'

import { useEmitter } from './use-emitter'
import { useForceRerender } from './use-force-rerender'

let focusedColumnId: string
let focusedItemId: string | number | null

export function useIsItemFocused(
  columnId: string,
  itemId: string | number,
  callback?: (isItemFocused: boolean) => void,
) {
  const forceRerender = useForceRerender()

  const isFocusedRef = useRef(
    focusedColumnId === columnId && focusedItemId === itemId,
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      focusedColumnId = payload.columnId
      focusedItemId = payload.itemId

      const newValue = focusedColumnId === columnId && focusedItemId === itemId
      if (isFocusedRef.current === newValue) return
      isFocusedRef.current = newValue

      if (callback) {
        callback(newValue)
        return
      }

      forceRerender()
    },
    [columnId, itemId, callback],
  )

  return isFocusedRef.current
}
