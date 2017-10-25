// @flow

import React from 'react'

import Columns from './_Columns'
import EventColumnContainer from '../../containers/EventColumnContainer'
import CreateColumnUtils from '../utils/CreateColumnUtils'
import type { ActionCreators } from '../../utils/types'

export default class EventColumns extends React.PureComponent {
  createColumnFn = ({ createColumnOrder, ...params } = {}, ...args) => {
    CreateColumnUtils.showColumnTypeSelectAlert(
      this.props.actions,
      {
        createColumnOrder,
        ...params,
      },
      ...args,
    )
  }

  props: {
    actions: ActionCreators,
    columnIds: Array<string>,
  }

  renderItem = ({ item: columnId, index }) => {
    if (!columnId) return null

    return (
      <EventColumnContainer
        key={`event-column-container-${columnId}`}
        createColumnFn={this.createColumnFn}
        createColumnOrder={index}
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
        createColumnFn={this.createColumnFn}
        items={columnIds}
        renderItem={this.renderItem}
        {...props}
      />
    )
  }
}
