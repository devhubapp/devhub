import React from 'react'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { sharedStyles } from '../../styles/shared'
import { GenericMessageWithButtonView } from '../cards/GenericMessageWithButtonView'
import { Column } from './Column'

export function NoFocusedColumn() {
  const { appViewMode } = useAppViewMode()

  return (
    <Column
      columnId=""
      fullWidth={appViewMode === 'single-column'}
      style={[sharedStyles.alignItemsCenter, sharedStyles.justifyContentCenter]}
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
