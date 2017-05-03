// @flow

import React from 'react'
import { List } from 'immutable'

import Columns from './_Columns'
import NotificationsFilterColumnContainer
  from '../../containers/NotificationsFilterColumnContainer'
import NotificationColumnContainer
  from '../../containers/NotificationColumnContainer'
import type { ActionCreators, Column as ColumnType } from '../../utils/types'

export default class NotificationColumns extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  }

  renderFilterColumn = column => (
    <NotificationsFilterColumnContainer column={column} />
  )

  renderItem = ({ item: column }) => {
    if (!column) return null

    const columnId = column.get('id')
    if (!columnId) return null

    if (columnId === 'filter') return this.renderFilterColumn(column)

    const { actions } = this.props

    return (
      <NotificationColumnContainer
        key={`notification-column-container-${columnId}`}
        actions={actions}
        column={column}
        icon={column.get('icon')}
        title={column.get('title')}
        {...column.get('column') || {}}
      />
    )
  }

  render() {
    const { actions, columns = List(), ...props } = this.props

    return (
      <Columns
        key="notification-_Columns"
        actions={actions}
        columns={columns}
        renderItem={this.renderItem}
        {...props}
      />
    )
  }
}
