import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Columns } from '../components/columns/Columns'
import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import * as selectors from '../redux/selectors'
import { ExtractPropsFromConnector } from '../types'

export interface ColumnsContainerProps {
  only?: 'events' | 'notifications'
}

export interface ColumnsContainerState {}

const connectToStore = connect((state: any) => ({
  columns: selectors.columnsSelector(state),
}))

class ColumnsContainerComponent extends PureComponent<
  ColumnsContainerProps & ExtractPropsFromConnector<typeof connectToStore>,
  ColumnsContainerState
> {
  render() {
    const { only } = this.props
    const _columns = this.props.columns || []

    const columns =
      only === 'notifications'
        ? _columns.filter(column => column.type === 'notifications')
        : only === 'events'
          ? _columns.filter(column => column.type !== 'notifications')
          : _columns

    const swipeable = columns.length === 1

    return (
      <Columns bounces={!swipeable} scrollEnabled={!swipeable}>
        {columns.map(
          (column, index) =>
            (column.type === 'notifications' && (
              <NotificationColumn
                key={`event-column-${index}`}
                column={column}
                swipeable={swipeable}
              />
            )) ||
            (column.type === 'activity' && (
              <EventColumn
                key={`event-column-${index}`}
                column={column}
                swipeable={swipeable}
              />
            )),
        )}
      </Columns>
    )
  }
}

export const ColumnsContainer = connectToStore(ColumnsContainerComponent)
