import React from 'react'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'
import { Columns } from './Columns'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const appViewMode = useReduxState(selectors.viewModeSelector)
  const columnIds = useReduxState(selectors.columnIdsSelector)

  const focusedColumnId = useFocusedColumn() || columnIds[0]

  if (appViewMode === 'single-column') {
    return (
      <ViewMeasurer style={{ flex: 1, flexDirection: 'row' }}>
        {({ height: containerHeight }) => (
          <>
            <ColumnOptionsRenderer
              key="column-options-renderer"
              columnId={focusedColumnId}
              containerHeight={containerHeight}
              forceOpenAll
              inlineMode
              startWithFiltersExpanded
              visible
            />

            <ColumnContainer
              key="single-column-container"
              columnId={focusedColumnId}
              disableColumnOptions
              swipeable
            />
          </>
        )}
      </ViewMeasurer>
    )
  }

  return <Columns key="columns" />
}
