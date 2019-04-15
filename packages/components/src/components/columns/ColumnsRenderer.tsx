import React from 'react'
import { Dimensions } from 'react-native'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight, sidebarSize } from '../../styles/variables'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'
import { Columns } from './Columns'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const columnIds = useReduxState(selectors.columnIdsSelector)

  const { appOrientation, sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId: _focusedColumnId } = useFocusedColumn()

  const focusedColumnId = _focusedColumnId || columnIds[0]

  if (appViewMode === 'single-column') {
    const shouldRenderFixedColumnOptions = sizename >= '4-x-large'

    const defaultContainerHeight =
      appOrientation === 'portrait'
        ? Dimensions.get('window').height - columnHeaderHeight - sidebarSize - 2
        : Dimensions.get('window').height - columnHeaderHeight - 1

    return (
      <ViewMeasurer
        key="columns-renderer-view-measurer"
        defaultMeasures={{ width: 0, height: defaultContainerHeight }}
        properties="height"
        style={[sharedStyles.flex, sharedStyles.horizontal]}
      >
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
