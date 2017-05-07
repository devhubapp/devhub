// @flow

import React from 'react'
import { List, Map } from 'immutable'

import Columns from './_Columns'
import EventColumnContainer from '../../containers/EventColumnContainer'
import CreateColumnUtils from '../utils/CreateColumnUtils'
import type { ActionCreators, Column as ColumnType } from '../../utils/types'

export default class EventColumns extends React.PureComponent {
  addColumnFn = ({ order } = {}, ...args) => {
    CreateColumnUtils.showColumnTypeSelectAlert(
      this.props.actions,
      {
        createColumnOrder: order,
      },
      ...args,
    )
  }

  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
  }

  renderItem = ({ item: column }) => {
    if (!column) return null

    const columnId = column.get('id')
    if (!columnId) return null

    return (
      <EventColumnContainer
        key={`event-column-container-${columnId}`}
        columnId={columnId}
      />
    )
  }

  render() {
    const { actions, columns: _columns, ...props } = this.props

    let columns = _columns ? _columns.toList() : List()

    if (columns.size === 0 || columns.last().get('id') !== 'new') {
      columns = columns.push(Map({ id: 'new', order: columns.size }))
    }

    return (
      <Columns
        key="event-columns"
        actions={actions}
        addColumnFn={this.addColumnFn}
        columns={columns}
        renderItem={this.renderItem}
        {...props}
      />
    )
  }
}
