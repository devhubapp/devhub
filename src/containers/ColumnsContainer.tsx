import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Columns } from '../components/columns/Columns'
import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { DimensionsConsumer } from '../components/context/DimensionsContext'
import * as selectors from '../redux/selectors'
import { Column, ExtractPropsFromConnector } from '../types'

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
  pagingEnabled: boolean = true
  swipeable: boolean = false

  renderColumn = (column: Column, index: number) => {
    switch (column.type) {
      case 'notifications': {
        return (
          <NotificationColumn
            key={`notification-column-${column.id}`}
            column={column}
            pagingEnabled={this.pagingEnabled}
            swipeable={this.swipeable}
          />
        )
      }

      case 'activity': {
        return (
          <EventColumn
            key={`event-column-${column.id}`}
            column={column}
            pagingEnabled={this.pagingEnabled}
            swipeable={this.swipeable}
          />
        )
      }

      default: {
        console.error('Invalid Column type: ', (column as any).type)
        return null
      }
    }
  }

  render() {
    const columns = this.props.columns || []

    this.swipeable = columns.length === 1

    return (
      <DimensionsConsumer>
        {({ width }) => {
          this.pagingEnabled = width <= 400

          return (
            <Columns
              bounces={!this.swipeable}
              pagingEnabled={this.pagingEnabled}
              scrollEnabled={!this.swipeable}
            >
              {columns.map(this.renderColumn)}
            </Columns>
          )
        }}
      </DimensionsConsumer>
    )
  }
}

export const ColumnsContainer = connectToStore(ColumnsContainerComponent)
