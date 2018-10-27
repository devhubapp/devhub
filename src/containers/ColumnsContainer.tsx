import _ from 'lodash'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import { Column } from '../components/columns/Column'
import { Columns } from '../components/columns/Columns'
import { EventColumn } from '../components/columns/EventColumn'
import { NotificationColumn } from '../components/columns/NotificationColumn'
import { Platform } from '../libs/platform'
import * as selectors from '../redux/selectors'
import { SettingsScreen } from '../screens/SettingsScreen'
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
        {Platform.realOS === 'web' && (
          <Column>
            <SettingsScreen navigation={{} as any} />
          </Column>
        )}

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
