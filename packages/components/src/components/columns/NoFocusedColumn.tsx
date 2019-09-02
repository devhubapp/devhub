import React from 'react'

import { sharedStyles } from '../../styles/shared'
import { GenericMessageWithButtonView } from '../cards/GenericMessageWithButtonView'
import { Column } from './Column'

export function NoFocusedColumn() {
  return (
    <Column
      columnId=""
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
