import React, { useState } from 'react'

import { getColumnHeaderDetails } from 'shared-core/dist/utils/helpers/github/events'
import {
  NotificationCardsContainer,
  NotificationCardsContainerProps,
} from '../../containers/NotificationCardsContainer'
import * as actions from '../../redux/actions'
import { useReduxAction } from '../../redux/hooks/use-redux-action'
import * as colors from '../../styles/colors'
import { hasAnyFilter } from '../../utils/helpers/filters'
import { Column } from './Column'
import { ColumnHeader } from './ColumnHeader'
import { ColumnHeaderItem } from './ColumnHeaderItem'
import { ColumnOptions } from './ColumnOptions'

export interface NotificationColumnProps
  extends NotificationCardsContainerProps {
  columnIndex: number
  pagingEnabled?: boolean
}

export function NotificationColumn(props: NotificationColumnProps) {
  const [showColumnOptions, setShowColumnOptions] = useState(false)
  const setColumnClearedAtFilter = useReduxAction(
    actions.setColumnClearedAtFilter,
  )

  const { column, columnIndex, pagingEnabled, subscriptions } = props

  const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

  return (
    <Column
      key={`notification-column-${column.id}-inner`}
      columnId={column.id}
      pagingEnabled={pagingEnabled}
    >
      <ColumnHeader>
        <ColumnHeaderItem
          fixedIconSize
          iconName={requestTypeIconAndData.icon}
          style={{ flex: 1 }}
          subtitle={requestTypeIconAndData.subtitle}
          title={requestTypeIconAndData.title}
        />

        <ColumnHeaderItem
          iconName="circle-slash"
          iconStyle={
            column.filters && column.filters.clearedAt
              ? { color: colors.brandBackgroundColor }
              : undefined
          }
          onPress={() =>
            setColumnClearedAtFilter({
              columnId: column.id,
              clearedAt: new Date().toISOString(),
            })
          }
        />
        <ColumnHeaderItem
          iconName="settings"
          iconStyle={
            column.filters &&
            hasAnyFilter({ ...column.filters, clearedAt: undefined })
              ? { color: colors.brandBackgroundColor }
              : undefined
          }
          onPress={() => setShowColumnOptions(!showColumnOptions)}
        />
      </ColumnHeader>

      {!!showColumnOptions && (
        <ColumnOptions column={column} columnIndex={columnIndex} />
      )}

      <NotificationCardsContainer
        key={`notification-cards-container-${column.id}`}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        {...props}
      />
    </Column>
  )
}
