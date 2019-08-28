import { useEffect, useRef } from 'react'

import { useEmitter } from './use-emitter'
import { useForceRerender } from './use-force-rerender'

let focusedColumnId: string
let focusedItemId: string | number | null

export function useIsItemFocused(
  columnId: string,
  itemId: string | number,
  callback?: (isItemFocused: boolean) => void,
  { skipFirstCallback = false }: { skipFirstCallback?: boolean } = {},
) {
  const forceRerender = useForceRerender()

  const isFocusedRef = useRef(false)
  isFocusedRef.current =
    focusedColumnId === columnId && focusedItemId === itemId

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

  useEffect(() => {
    if (callback && isFocusedRef.current && !skipFirstCallback)
      callback(isFocusedRef.current)
  })

  return isFocusedRef.current
}
