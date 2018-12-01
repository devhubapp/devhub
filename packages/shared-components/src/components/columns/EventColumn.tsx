import React, { useState } from 'react'

import { getColumnHeaderDetails } from 'shared-core/dist/utils/helpers/github/events'
import {
  EventCardsContainer,
  EventCardsContainerProps,
} from '../../containers/EventCardsContainer'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptions } from './ColumnOptions'

export interface EventColumnProps extends EventCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export function EventColumn(props: EventColumnProps) {
  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const { column, columnIndex, pagingEnabled, subscriptions } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <Column
      key={`event-column-${column.id}-inner`}
      columnId={column.id}
      pagingEnabled={pagingEnabled}
    >
      <ColumnHeader>
        <ColumnHeaderItem
          avatarProps={requestTypeIconAndData.avatarProps}
          fixedIconSize
          iconName={requestTypeIconAndData.icon}
          style={{ flex: 1 }}
          subtitle={requestTypeIconAndData.subtitle}
          title={requestTypeIconAndData.title}
        />

        <ColumnHeaderItem
          iconName="circle-slash"
          onPress={() =>
            setColumnClearedAtFilter({
              columnId: column.id,
              clearedAt: new Date().toISOString(),
            })
          }
        />
        <ColumnHeaderItem
          iconName="settings"
          onPress={() => setShowColumnOptions(!showColumnOptions)}
        />
      </ColumnHeader>

      {!!showColumnOptions && (
        <ColumnOptions column={column} columnIndex={columnIndex} />
      )}

      <EventCardsContainer
        key={`event-cards-container-${column.id}`}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        {...props}
      />
    </Column>
  )
}
