import React, { useCallback } from 'react'
import { Dimensions } from 'react-native'

import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { emitter } from '../../libs/emitter'
import { SafeAreaView } from '../../libs/safe-area-view'
import { sharedStyles } from '../../styles/shared'
import { columnHeaderHeight, sidebarSize } from '../../styles/variables'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { useAppLayout } from '../context/LayoutContext'
import { ViewMeasurer } from '../render-props/ViewMeasure'
import { ColumnOptionsRenderer } from './ColumnOptionsRenderer'
import { Columns } from './Columns'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const { appOrientation, sizename } = useAppLayout()
  const { appViewMode } = useAppViewMode()
  const { focusedColumnId } = useFocusedColumn()
  const {
    enableSharedFiltersView,
    inlineMode,
    isSharedFiltersOpened,
  } = useColumnFilters()

  const closeSharedFiltersView = useCallback(
    () => emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId: focusedColumnId! }),
    [focusedColumnId],
  )

  if (appViewMode === 'single-column' || sizename === '1-small') {
    if (!focusedColumnId) return null

    const defaultContainerHeight =
      appOrientation === 'portrait'
        ? Dimensions.get('window').height - columnHeaderHeight - sidebarSize - 2
        : Dimensions.get('window').height - columnHeaderHeight - 1

    return (
      <SafeAreaView style={sharedStyles.flex}>
        <ViewMeasurer
          key="columns-renderer-view-measurer"
          defaultMeasures={{ width: 0, height: defaultContainerHeight }}
          properties="height"
          style={[sharedStyles.flex, sharedStyles.horizontal]}
        >
          {({ height: containerHeight }) => (
            <>
              {!!enableSharedFiltersView && (
                <ColumnOptionsRenderer
                  key="column-options-renderer"
                  columnId={focusedColumnId}
                  containerHeight={containerHeight}
                  fixedPosition="right"
                  fixedWidth={250}
                  forceOpenAll
                  inlineMode={inlineMode}
                  isOpen={isSharedFiltersOpened}
                  renderHeader={inlineMode ? 'yes' : 'spacing-only'}
                  startWithFiltersExpanded
                  close={closeSharedFiltersView}
                />
              )}

              {appViewMode === 'single-column' ? (
                <ColumnContainer
                  key="single-column-container"
                  columnId={focusedColumnId}
                  disableColumnOptions={inlineMode}
                  // swipeable
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
