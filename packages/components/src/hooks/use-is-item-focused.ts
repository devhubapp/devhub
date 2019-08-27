import { useState } from 'react'

import { useEmitter } from './use-emitter'

let focusedColumnId: string
let focusedItemId: string | number | null

export function useIsItemFocused(columnId: string, itemId: string | number) {
  const [isFocused, setIsFocused] = useState(
    focusedColumnId === columnId && focusedItemId === itemId,
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    payload => {
      focusedColumnId = payload.columnId
      focusedItemId = payload.itemId

      const newValue = focusedColumnId === columnId && focusedItemId === itemId
      if (isFocused === newValue) return

      setIsFocused(newValue)
    },
    [columnId, itemId, isFocused],
  )

  return isFocused
}
