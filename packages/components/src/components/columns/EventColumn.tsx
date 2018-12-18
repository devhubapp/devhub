import React, { useState } from 'react'
import { View } from 'react-native'

import { getColumnHeaderDetails } from '@devhub/core'
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
  const [
    columnOptionsAvailablHeight,
    setColumnOptionsAvailablHeight,
  ] = useState(0)
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
          analyticsLabel={undefined}
          avatarProps={requestTypeIconAndData.avatarProps}
          fixedIconSize
          iconName={requestTypeIconAndData.icon}
          style={{ flex: 1 }}
          subtitle={requestTypeIconAndData.subtitle}
          title={requestTypeIconAndData.title}
        />

        <ColumnHeaderItem
          analyticsLabel="clear_column"
          disabled={
            column.filters &&
            column.filters.inbox &&
            column.filters.inbox &&
            column.filters.inbox.archived === true
          }
          iconName="check"
          onPress={() =>
            setColumnClearedAtFilter({
              columnId: column.id,
              clearedAt: new Date().toISOString(),
            })
          }
        />
        <ColumnHeaderItem
          analyticsAction={showColumnOptions ? 'hide' : 'show'}
          analyticsLabel="column_options"
          iconName="settings"
          onPress={() => setShowColumnOptions(!showColumnOptions)}
        />
      </ColumnHeader>

      <View
        style={{ flex: 1 }}
        onLayout={e => {
          setColumnOptionsAvailablHeight(e.nativeEvent.layout.height)
        }}
      >
        {!!showColumnOptions && (
          <ColumnOptions
            availableHeight={columnOptionsAvailablHeight}
            column={column}
            columnIndex={columnIndex}
          />
        )}

        <EventCardsContainer
          key={`event-cards-container-${column.id}`}
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...props}
        />
      </View>
    </Column>
  )
}
