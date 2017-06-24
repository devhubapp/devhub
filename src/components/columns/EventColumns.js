// @flow

import React from 'react'

import Columns from './_Columns'
import EventColumnContainer from '../../containers/EventColumnContainer'
import CreateColumnUtils from '../utils/CreateColumnUtils'
import type { ActionCreators } from '../../utils/types'

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
    columnIds: Array<string>,
  }

  renderItem = ({ item: columnId }) => {
    if (!columnId) return null

    return (
      <EventColumnContainer
        key={`event-column-container-${columnId}`}
        columnId={columnId}
      />
    )
  }

  render() {
    const { actions, columnIds, ...props } = this.props

    return (
      <Columns
        key="event-columns"
        actions={actions}
        addColumnFn={this.addColumnFn}
        columnIds={columnIds}
        renderItem={this.renderItem}
        {...props}
      />
    )
  }
}
