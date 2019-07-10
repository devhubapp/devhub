import React, { useCallback } from 'react'
import { Dimensions } from 'react-native'

import { constants } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import { SafeAreaView } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight, sidebarSize } from '../../styles/variables'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { Columns } from './Columns'
import { NoColumns } from './NoColumns'
import { NoFocusedColumn } from './NoFocusedColumn'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const { appOrientation, sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const {
    enableSharedFiltersView,
    fixedWidth,
    inlineMode,
    isSharedFiltersOpened,
  } = useColumnFilters()
  const columnIds = useReduxState(selectors.columnIdsSelector)

  const closeSharedFiltersView = useCallback(
    () => emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId: focusedColumnId! }),
    [focusedColumnId],
  )

  if (!columnIds.length) {
    return <NoColumns fullWidth />
  }

  if (appViewMode === 'single-column' || sizename === '1-small') {
    if (!focusedColumnId) {
      return <NoFocusedColumn />
    }

    const defaultContainerHeight =
      appOrientation === 'portrait'
        ? Dimensions.get('window').height - columnHeaderHeight - sidebarSize - 2
        : Dimensions.get('window').height - columnHeaderHeight - 1

    return (
      <SafeAreaView style={sharedStyles.flex}>
        <ViewMeasurer
          key="columns-renderer-view-measurer"
          initialResult={defaultContainerHeight}
          mapper={({ height }) => height}
          style={[sharedStyles.flex, sharedStyles.horizontal]}
        >
          {(containerHeight: number) => (
            <>
              {!!enableSharedFiltersView && (
                <ColumnFiltersRenderer
                  key="column-options-renderer"
                  columnId={focusedColumnId}
                  containerHeight={containerHeight}
                  fixedPosition="right"
                  fixedWidth={fixedWidth}
                  forceOpenAll
                  inlineMode={inlineMode}
                  isOpen={isSharedFiltersOpened}
                  shouldRenderHeader="yes"
                  startWithFiltersExpanded
                  close={closeSharedFiltersView}
                />
              )}

              {appViewMode === 'single-column' ? (
                <ColumnContainer
                  key="single-column-container"
                  columnId={focusedColumnId}
                  pointerEvents={
                    isSharedFiltersOpened && !inlineMode ? 'none' : undefined
                  }
                  swipeable={!constants.DISABLE_SWIPEABLE_CARDS}
                />
              ) : (
                <Columns
                  key="columns"
                  pointerEvents={isSharedFiltersOpened ? 'none' : undefined}
                />
              )}
            </>
          )}
        </ViewMeasurer>
      </SafeAreaView>
    )
  }

  return <Columns key="columns" />
}
