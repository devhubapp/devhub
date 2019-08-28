import { useState } from 'react'

import { useEmitter } from './use-emitter'

let focusedColumnId: string

export function useIsColumnFocused(columnId: string) {
  const [isFocused, setIsFocused] = useState(focusedColumnId === columnId)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      focusedColumnId = payload.columnId

      const newValue = focusedColumnId === columnId
      if (isFocused === newValue) return

      setIsFocused(newValue)
    },
    [columnId, isFocused],
  )

  return isFocused
}
