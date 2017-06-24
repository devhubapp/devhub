// @flow

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import EventColumns from '../components/columns/EventColumns'
import { columnIdsSelector } from '../selectors'
import * as actionCreators from '../actions'
import type { ActionCreators, State } from '../utils/types'

const mapStateToProps = (state: State) => ({
  columnIds: columnIdsSelector(state),
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class EventColumnContainer extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columnIds: Array<string>,
  }

  render() {
    const { actions, columnIds, ...props } = this.props

    return (
      <EventColumns
        key="event-columns"
        actions={actions}
        columnIds={columnIds}
        {...props}
      />
    )
  }
}
