import React, { useContext, useState } from 'react'

import { useEmitter } from '../../hooks/use-emitter'

export interface ColumnFocusProviderProps {
  children?: React.ReactNode
}

export type ColumnFocusProviderState = string | null

export const ColumnFocusContext = React.createContext<ColumnFocusProviderState>(
  null,
)

export function ColumnFocusProvider(props: ColumnFocusProviderProps) {
  const [columnId, setColumnId] = useState<ColumnFocusProviderState>(null)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      setColumnId(payload.columnId || null)
    },
    [],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    payload => {
      setColumnId(payload.columnId || null)
    },
    [],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    payload => {
      setColumnId(payload.columnId || null)
    },
    [],
  )

  return (
    <ColumnFocusContext.Provider value={columnId}>
      {props.children}
    </ColumnFocusContext.Provider>
  )
}

export const ColumnFocusConsumer = ColumnFocusContext.Consumer

export function useFocusedColumn() {
  return useContext(ColumnFocusContext)
}
