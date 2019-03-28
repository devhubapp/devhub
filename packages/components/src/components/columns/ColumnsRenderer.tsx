import React from 'react'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'
import { Columns } from './Columns'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const columnIds = useReduxState(selectors.columnIdsSelector)

  const { sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const focusedColumnId = useFocusedColumn() || columnIds[0]

  if (appViewMode === 'single-column') {
    const shouldRenderFixedColumnOptions = sizename > '4-x-large'

    return (
      <ViewMeasurer style={{ flex: 1, flexDirection: 'row' }}>
        {({ height: containerHeight }) => (
          <>
            {!!shouldRenderFixedColumnOptions && (
              <ColumnOptionsRenderer
                key="column-options-renderer"
                columnId={focusedColumnId}
                containerHeight={containerHeight}
                forceOpenAll
                inlineMode
                startWithFiltersExpanded
                visible
              />
            )}

            <ColumnContainer
              key="single-column-container"
              columnId={focusedColumnId}
              disableColumnOptions={shouldRenderFixedColumnOptions}
              // swipeable
            />
          </>
        )}
      </ViewMeasurer>
    )
  }

  return <Columns key="columns" />
}
