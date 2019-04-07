import React, { useContext, useState } from 'react'

import { useEmitter } from '../../hooks/use-emitter'
import { emitter } from '../../libs/emitter'
import { useReduxStore } from '../../redux/context/ReduxStoreContext'
import * as selectors from '../../redux/selectors'

export interface ColumnFocusProviderProps {
  children?: React.ReactNode
}

export type ColumnFocusProviderState = string | null

export const ColumnFocusContext = React.createContext<ColumnFocusProviderState>(
  null,
)

export function ColumnFocusProvider(props: ColumnFocusProviderProps) {
  const store = useReduxStore()
  const [columnId, setColumnId] = useState<ColumnFocusProviderState>(null)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      setColumnId(payload.columnId || null)
    },
    [],
  )

  useEmitter(
    'FOCUS_ON_PREVIOUS_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(id => id === (columnId || columnIds[0]))
        : -1

      const previousColumnIndex = Math.max(
        0,
        Math.min(focusedColumnIndex - 1, columnIds.length - 1),
      )

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[previousColumnIndex],
        columnIndex: previousColumnIndex,
      })
    },
    [columnId],
  )

  useEmitter(
    'FOCUS_ON_NEXT_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(id => id === (columnId || columnIds[0]))
        : -1

      const nextColumnIndex = Math.max(
        0,
        Math.min(focusedColumnIndex + 1, columnIds.length - 1),
      )

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[nextColumnIndex],
        columnIndex: nextColumnIndex,
      })
    },
    [columnId],
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
