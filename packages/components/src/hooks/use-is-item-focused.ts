import { useEffect, useRef } from 'react'

import { useEmitter } from './use-emitter'
import { useForceRerender } from './use-force-rerender'

let focusedColumnId: string
let focusedItemNodeIdOrId: string | null | undefined

export function useIsItemFocused(
  columnId: string,
  itemNodeIdOrId: string,
  callback?: (isItemFocused: boolean) => void,
  { skipFirstCallback = false }: { skipFirstCallback?: boolean } = {},
) {
  const forceRerender = useForceRerender()

  const isFocusedRef = useRef(false)
  isFocusedRef.current =
    focusedColumnId === columnId && focusedItemNodeIdOrId === itemNodeIdOrId

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      focusedColumnId = payload.columnId
      focusedItemNodeIdOrId = payload.itemNodeIdOrId

      const newValue =
        focusedColumnId === columnId && focusedItemNodeIdOrId === itemNodeIdOrId
      if (isFocusedRef.current === newValue) return
      isFocusedRef.current = newValue

      if (callback) {
        callback(newValue)
        return
      }

      forceRerender()
    },
    [columnId, itemNodeIdOrId, callback],
  )

  useEffect(() => {
    if (callback && isFocusedRef.current && !skipFirstCallback)
      callback(isFocusedRef.current)
  })

  return isFocusedRef.current
}
