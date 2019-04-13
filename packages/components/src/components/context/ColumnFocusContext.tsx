import React, { useContext, useState } from 'react'

import { useEmitter } from '../../hooks/use-emitter'
import { emitter } from '../../libs/emitter'
import { useReduxStore } from '../../redux/context/ReduxStoreContext'
import * as selectors from '../../redux/selectors'

export interface ColumnFocusProviderProps {
  children?: React.ReactNode
}

export interface ColumnFocusProviderState {
  focusedColumnId: string | null
  focusedColumnIndex: number
}

const defaultValue: ColumnFocusProviderState = {
  focusedColumnId: null,
  focusedColumnIndex: -1,
}
export const ColumnFocusContext = React.createContext<ColumnFocusProviderState>(
  defaultValue,
)

export function ColumnFocusProvider(props: ColumnFocusProviderProps) {
  const store = useReduxStore()
  const [value, setValue] = useState<ColumnFocusProviderState>(defaultValue)

  useEmitter(
    'FOCUS_ON_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)

      const focusedColumnId = payload.columnId || null
      const focusedColumnIndex =
        columnIds && focusedColumnId
          ? columnIds.findIndex(id => id === focusedColumnId)
          : -1

      setValue({ focusedColumnId, focusedColumnIndex })
    },
    [],
  )

  useEmitter(
    'FOCUS_ON_PREVIOUS_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(
            id => id === (value.focusedColumnId || columnIds[0]),
          )
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
    [value.focusedColumnId],
  )

  useEmitter(
    'FOCUS_ON_NEXT_COLUMN',
    payload => {
      const state = store.getState()
      const columnIds = selectors.columnIdsSelector(state)
      const focusedColumnIndex = columnIds
        ? columnIds.findIndex(
            id => id === (value.focusedColumnId || columnIds[0]),
          )
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
    [value.focusedColumnId],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    payload => {
      setValue({
        focusedColumnId: payload.columnId || null,
        focusedColumnIndex: payload.columnIndex,
      })
    },
    [],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    payload => {
      setValue({
        focusedColumnId: payload.columnId || null,
        focusedColumnIndex: payload.columnIndex,
      })
    },
    [],
  )

  return (
    <ColumnFocusContext.Provider value={value}>
      {props.children}
    </ColumnFocusContext.Provider>
  )
}

export const ColumnFocusConsumer = ColumnFocusContext.Consumer

export function useFocusedColumn() {
  return useContext(ColumnFocusContext)
}
