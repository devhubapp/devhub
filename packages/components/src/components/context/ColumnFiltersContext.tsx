import React, { useContext, useEffect, useRef, useState } from 'react'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useEmitter } from '../../hooks/use-emitter'
import { useForceRerender } from '../../hooks/use-force-rerender'
import { useAppLayout } from './LayoutContext'

export interface ColumnFiltersProviderProps {
  children?: React.ReactNode
}

export interface ColumnFiltersProviderState {
  enableSharedFiltersView: boolean
  inlineMode: boolean
  isSharedFiltersOpened: boolean
}

const defaultValue: ColumnFiltersProviderState = {
  enableSharedFiltersView: false,
  inlineMode: false,
  isSharedFiltersOpened: false,
}
export const ColumnFiltersContext = React.createContext<
  ColumnFiltersProviderState
>(defaultValue)

export function ColumnFiltersProvider(props: ColumnFiltersProviderProps) {
  const forceRerender = useForceRerender()

  const { sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()

  const enableSharedFiltersView =
    appViewMode === 'single-column' || sizename === '1-small'

  const inlineMode = appViewMode === 'single-column' && sizename >= '4-x-large'

  const valueCacheRef = useRef<ColumnFiltersProviderState>({
    enableSharedFiltersView,
    inlineMode,
    isSharedFiltersOpened: inlineMode,
  })

  const [isOpened, setIsOpened] = useState(inlineMode)

  const isSharedFiltersOpened =
    inlineMode || (enableSharedFiltersView && isOpened)

  useEmitter(
    'TOGGLE_COLUMN_FILTERS',
    () => {
      if (!enableSharedFiltersView) return
      setIsOpened(v => !v)
    },
    [enableSharedFiltersView],
  )

  useEffect(() => {
    valueCacheRef.current = {
      enableSharedFiltersView,
      inlineMode,
      isSharedFiltersOpened,
    }

    forceRerender()
  }, [enableSharedFiltersView, inlineMode, isSharedFiltersOpened])

  return (
    <ColumnFiltersContext.Provider value={valueCacheRef.current}>
      {props.children}
    </ColumnFiltersContext.Provider>
  )
}

export const ColumnFiltersConsumer = ColumnFiltersContext.Consumer

export function useColumnFilters() {
  return useContext(ColumnFiltersContext)
}
