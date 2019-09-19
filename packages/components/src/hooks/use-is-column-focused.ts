import { useState } from 'react'

import { getCurrentFocusedColumnId } from '../components/context/ColumnFocusContext'
import { useDynamicRef } from './use-dynamic-ref'
import { useEmitter } from './use-emitter'

export function useIsColumnFocused(columnId: string) {
  const [isFocused, setIsFocused] = useState(
    getCurrentFocusedColumnId() === columnId,
  )

  const columnIdRef = useDynamicRef(columnId)
  const isFocusedRef = useDynamicRef(isFocused)
  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      const newValue = payload.columnId === columnIdRef.current
      if (isFocusedRef.current === newValue) return
      setIsFocused(newValue)
    },
    [],
  )

  return isFocused
}
