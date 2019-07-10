import React, { useCallback, useMemo } from 'react'

import { emitter } from '../../libs/emitter'
import { contentPadding } from '../../styles/variables'
import { ColumnHeaderItem } from './ColumnHeaderItem'

export interface ColumnFiltersButtonProps {
  columnId: string
}

export const ColumnFiltersButton = React.memo(
  (props: ColumnFiltersButtonProps) => {
    const { columnId } = props

    const focusColumn = useCallback(() => {
      emitter.emit('FOCUS_ON_COLUMN', {
        columnId,
        highlight: false,
        scrollTo: false,
      })
    }, [columnId])

    const toggleColumnFilters = useCallback(() => {
      emitter.emit('TOGGLE_COLUMN_FILTERS', { columnId })
    }, [columnId])

    const onPress = useCallback(() => {
      focusColumn()
      toggleColumnFilters()
    }, [focusColumn, toggleColumnFilters])

    const style = useMemo(
      () => ({
        paddingHorizontal: contentPadding / 3,
      }),
      [],
    )

    return (
      <ColumnHeaderItem
        key="column-filters-toggle-button"
        analyticsAction="toggle"
        analyticsLabel="column_filters"
        enableForegroundHover
        fixedIconSize
        iconName="settings"
        onPress={onPress}
        style={style}
        tooltip="Filters"
      />
    )
  },
)

ColumnFiltersButton.displayName = 'ColumnFiltersButton'
