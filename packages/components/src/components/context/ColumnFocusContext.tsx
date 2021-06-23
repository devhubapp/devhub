import React, { useContext, useEffect, useRef } from 'react'

import { useEmitter } from '../../hooks/use-emitter'
import { useForceRerender } from '../../hooks/use-force-rerender'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
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
export const ColumnFocusContext =
  React.createContext<ColumnFocusProviderState>(defaultValue)
ColumnFocusContext.displayName = 'ColumnFocusContext'

let _focusedColumnId: string | null
export function ColumnFocusProvider(props: ColumnFocusProviderProps) {
  const forceRerender = useForceRerender()
  const valueRef = useRef<ColumnFocusProviderState>(defaultValue)
  const columnIds = useReduxState(selectors.columnIdsSelector)

  // force always having a valid column focused
  const fixedFocusedColumnIndex = columnIds.length
    ? valueRef.current.focusedColumnId &&
      columnIds.findIndex((id) => id === valueRef.current.focusedColumnId) >= 0
      ? columnIds.findIndex((id) => id === valueRef.current.focusedColumnId)
      : valueRef.current.focusedColumnIndex >= 0 &&
        valueRef.current.focusedColumnIndex < columnIds.length
      ? valueRef.current.focusedColumnIndex
      : valueRef.current.focusedColumnIndex > 1
      ? columnIds.length - 1
      : 0
    : -1

  const fixedFocusedColumnId = columnIds[fixedFocusedColumnIndex]

  if (
    valueRef.current.focusedColumnId !== fixedFocusedColumnId ||
    valueRef.current.focusedColumnIndex !== fixedFocusedColumnIndex
  ) {
    valueRef.current = {
      focusedColumnId: fixedFocusedColumnId,
      focusedColumnIndex: fixedFocusedColumnIndex,
    }
  }

  useEffect(() => {
    if (valueRef.current.focusedColumnId !== fixedFocusedColumnId) return

    emitter.emit('FOCUS_ON_COLUMN', {
      animated: false,
      columnId: fixedFocusedColumnId,
      focusOnVisibleItem: false,
      highlight: false,
      scrollTo: false,
    })
  }, [])

  useEmitter(
    'FOCUS_ON_COLUMN',
    (payload) => {
      const focusedColumnId = payload.columnId || null
      const focusedColumnIndex =
        columnIds && focusedColumnId
          ? columnIds.findIndex((id) => id === focusedColumnId)
          : -1

      if (
        valueRef.current.focusedColumnId === focusedColumnId &&
        valueRef.current.focusedColumnIndex === focusedColumnIndex
      )
        return

      valueRef.current = { focusedColumnId, focusedColumnIndex }
      forceRerender()
    },
    [columnIds],
  )

  useEmitter(
    'FOCUS_ON_PREVIOUS_COLUMN',
    (payload) => {
      const previousColumnIndex = Math.max(
        0,
        Math.min(valueRef.current.focusedColumnIndex - 1, columnIds.length - 1),
      )
      if (previousColumnIndex === valueRef.current.focusedColumnIndex) return

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[previousColumnIndex],
      })
    },
    [columnIds],
  )

  useEmitter(
    'FOCUS_ON_NEXT_COLUMN',
    (payload) => {
      const nextColumnIndex = Math.max(
        0,
        Math.min(valueRef.current.focusedColumnIndex + 1, columnIds.length - 1),
      )
      if (nextColumnIndex === valueRef.current.focusedColumnIndex) return

      emitter.emit('FOCUS_ON_COLUMN', {
        ...payload,
        columnId: columnIds[nextColumnIndex],
      })
    },
    [columnIds],
  )

  useEmitter(
    'FOCUS_ON_COLUMN_ITEM',
    (payload) => {
      if (valueRef.current.focusedColumnId === (payload.columnId || null))
        return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: payload.columnId || '',
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [],
  )

  useEmitter(
    'SCROLL_TOP_COLUMN',
    (payload) => {
      if (valueRef.current.focusedColumnId === (payload.columnId || null))
        return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: payload.columnId || '',
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [],
  )

  useEmitter(
    'SCROLL_DOWN_COLUMN',
    (payload) => {
      if (
        valueRef.current.focusedColumnId === (payload.columnId || null) &&
        valueRef.current.focusedColumnIndex === payload.columnIndex
      )
        return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: payload.columnId || '',
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [],
  )

  useEmitter(
    'SCROLL_UP_COLUMN',
    (payload) => {
      if (
        valueRef.current.focusedColumnId === (payload.columnId || null) &&
        valueRef.current.focusedColumnIndex === payload.columnIndex
      )
        return

      emitter.emit('FOCUS_ON_COLUMN', {
        animated: false,
        columnId: payload.columnId || '',
        focusOnVisibleItem: false,
        highlight: false,
        scrollTo: false,
      })
    },
    [],
  )

  _focusedColumnId = valueRef.current.focusedColumnId

  return (
    <ColumnFocusContext.Provider value={valueRef.current}>
      {props.children}
    </ColumnFocusContext.Provider>
  )
}

export const ColumnFocusConsumer = ColumnFocusContext.Consumer

export function useFocusedColumn() {
  return useContext(ColumnFocusContext)
}

export function getCurrentFocusedColumnId() {
  return _focusedColumnId
}
