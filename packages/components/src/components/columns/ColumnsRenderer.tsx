import React, { useMemo } from 'react'
import { View } from 'react-native'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import { sharedStyles } from '../../styles/shared'
import { useColumnFilters } from '../context/ColumnFiltersContext'
import { ColumnFiltersRenderer } from './ColumnFiltersRenderer'
import { Columns } from './Columns'

export interface ColumnsRendererProps {}

export function ColumnsRenderer() {
  const { appViewMode } = useAppViewMode()

  const { enableSharedFiltersView, inlineMode } = useColumnFilters()

  const hasColumns = useReduxState(
    state => !!selectors.columnIdsSelector(state).length,
  )

  // if (appViewMode === 'single-column' && !focusedColumnId && columnIds.length) {
  //   return <NoFocusedColumn />
  // }

  const ColumnsComponent = useMemo(() => <Columns key="columns" />, [])

  const FiltersComponent = useMemo(
    () =>
      appViewMode === 'single-column' &&
      !!enableSharedFiltersView &&
      !!hasColumns && (
        <ColumnFiltersRenderer
          key="column-options-renderer"
          columnId="focused"
          fixedPosition="right"
          forceOpenAll={inlineMode}
          header="header"
          type="shared"
        />
      ),
    [
      appViewMode === 'single-column' &&
        !!enableSharedFiltersView &&
        !!hasColumns,
    ],
  )

  return (
    <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
      {FiltersComponent}
      {ColumnsComponent}
    </View>
  )
}
