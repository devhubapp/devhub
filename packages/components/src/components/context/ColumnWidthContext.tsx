import React, { useContext } from 'react'
import { Dimensions } from 'react-native'

import { constants } from '@devhub/core'
import { useDimensions } from '../../hooks/use-dimensions'
import { sidebarWidth } from '../common/SidebarOrBottomBar'
import { APP_LAYOUT_BREAKPOINTS, getAppLayout } from './LayoutContext'

export interface ColumnWidthProviderProps {
  children?: React.ReactNode
}

export type ColumnWidthProviderState = number

export const ColumnWidthContext = React.createContext<ColumnWidthProviderState>(
  calculateColumnWidth({ windowWidth: Dimensions.get('window').width }),
)
ColumnWidthContext.displayName = 'ColumnWidthContext'

export function ColumnWidthProvider(props: ColumnWidthProviderProps) {
  const { width: windowWidth } = useDimensions('width')
  const columnWidth = calculateColumnWidth({ windowWidth })

  return (
    <ColumnWidthContext.Provider value={columnWidth}>
      {props.children}
    </ColumnWidthContext.Provider>
  )
}

export const ColumnWidthConsumer = ColumnWidthContext.Consumer
;(ColumnWidthConsumer as any).displayName = 'ColumnWidthConsumer'

function calculateColumnWidth({
  windowWidth,
  minWidth: _minWidth = constants.MIN_COLUMN_WIDTH,
  maxWidth: _maxWidth = constants.MAX_COLUMN_WIDTH,
}: {
  windowWidth: number
  minWidth?: number
  maxWidth?: number
}) {
  const availableWidth =
    windowWidth -
    (getAppLayout().appOrientation === 'portrait' ? 0 : sidebarWidth)

  const minWidth = _minWidth && _minWidth > 0 ? _minWidth : 0
  const maxWidth = Math.min(
    windowWidth <= APP_LAYOUT_BREAKPOINTS.MEDIUM
      ? availableWidth
      : _maxWidth && _maxWidth >= 0
      ? _maxWidth
      : availableWidth,
    windowWidth,
  )

  return Math.max(minWidth, maxWidth)
}

export function useColumnWidth() {
  return useContext(ColumnWidthContext)
}
