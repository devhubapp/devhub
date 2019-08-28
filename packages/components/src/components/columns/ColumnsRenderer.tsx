import React, { useCallback } from 'react'

import { constants } from '@devhub/core'
import { ColumnContainer } from '../../containers/ColumnContainer'
import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import { emitter } from '../../libs/emitter'
import { SafeAreaView } from '../../libs/safe-area-view'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { useFocusedColumn } from '../context/ColumnFocusContext'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { Columns } from './Columns'
import { NoColumns } from './NoColumns'
import { NoFocusedColumn } from './NoFocusedColumn'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
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

  if (appViewMode === 'single-column') {
    if (!focusedColumnId) {
      return <NoFocusedColumn />
    }

    return (
      <SafeAreaView style={[sharedStyles.flex, sharedStyles.horizontal]}>
        <>
          {!!enableSharedFiltersView && (
            <ColumnFiltersRenderer
              key="column-options-renderer"
              columnId={focusedColumnId}
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

          <ColumnContainer
            key="single-column-container"
            columnId={focusedColumnId}
            pointerEvents={
              isSharedFiltersOpened && !inlineMode ? 'none' : undefined
            }
            swipeable={!constants.DISABLE_SWIPEABLE_CARDS}
          />
        </>
      </SafeAreaView>
    )
  }

  return <Columns />
}
