import React from 'react'

import { useAppViewMode } from '../../hooks/use-app-view-mode'
import { GenericMessageWithButtonView } from '../cards/GenericMessageWithButtonView'
import { Column, ColumnProps } from './Column'

export interface NoColumnsProps extends Omit<ColumnProps, 'columnId'> {}

export function NoColumns(props: NoColumnsProps) {
  const { appViewMode } = useAppViewMode()

  return (
    <Column
      columnId=""
      fullWidth={appViewMode === 'single-column'}
      {...props}
      style={[{ alignItems: 'center', justifyContent: 'center' }, props.style]}
    >
      <GenericMessageWithButtonView
        buttonView={undefined}
        emoji="wave"
        title="Welcome to DevHub :)"
        subtitle={'Add a column by tapping the "+" button'}
      />
    </Column>
  )
}
