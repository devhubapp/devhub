import React from 'react'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { GenericMessageWithButtonView } from '../cards/GenericMessageWithButtonView'
import { Column } from './Column'

export function NoFocusedColumn() {
  const { appViewMode } = useAppViewMode()

  return (
    <Column
      columnId=""
      fullWidth={appViewMode === 'single-column'}
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <GenericMessageWithButtonView
        buttonView={undefined}
        emoji="vulcan_salute"
        title="Nothing selected"
        subtitle="Please select a column to show here"
      />
    </Column>
  )
}
