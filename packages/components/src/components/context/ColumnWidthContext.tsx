import React, { useContext, useEffect, useState } from 'react'
import { Dimensions, ScaledSize } from 'react-native'

import { constants } from '@devhub/core'
import { sidebarSize } from '../../styles/variables'
import { APP_LAYOUT_BREAKPOINTS, getLayoutConsumerState } from './LayoutContext'

export interface ColumnWidthProviderProps {
  children?: React.ReactNode
}

export type ColumnWidthProviderState = number

export const ColumnWidthContext = React.createContext<ColumnWidthProviderState>(
  calculateColumnWidth({ window: Dimensions.get('window') }),
)

export function ColumnWidthProvider(props: ColumnWidthProviderProps) {
  const [width, setWidth] = useState(() =>
    calculateColumnWidth({ window: Dimensions.get('window') }),
  )

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      const w = calculateColumnWidth({ window })
      setWidth(w)
    }

    Dimensions.addEventListener('change', handler)

    return () => Dimensions.removeEventListener('change', handler)
  }, [])

  return (
    <ColumnWidthContext.Provider value={width}>
      {props.children}
    </ColumnWidthContext.Provider>
  )
}

export const ColumnWidthConsumer = ColumnWidthContext.Consumer

function calculateColumnWidth({
  window,
  minWidth: _minWidth = constants.MIN_COLUMN_WIDTH,
  maxWidth: _maxWidth = constants.MAX_COLUMN_WIDTH,
}: {
  window: { width: number; height: number }
  minWidth?: number
  maxWidth?: number
}) {
  const horizontal = getLayoutConsumerState().appOrientation === 'landscape'

  const availableWidth = window.width - (horizontal ? sidebarSize : 0)

  const minWidth = _minWidth && _minWidth > 0 ? _minWidth : 0
  const maxWidth = Math.min(
    window.width <= APP_LAYOUT_BREAKPOINTS.MEDIUM
      ? availableWidth
      : _maxWidth && _maxWidth >= 0
      ? _maxWidth
      : availableWidth,
    window.width,
  )

  return Math.max(minWidth, maxWidth)
}

export function useColumnWidth() {
  return useContext(ColumnWidthContext)
}
