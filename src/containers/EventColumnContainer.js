// @flow

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import EventColumn from '../components/columns/EventColumn'
import { getRequestTypeIcon, requestTypes } from '../api/github'

import {
  makeColumnErrorsSelector,
  makeColumnIsEmptySelector,
  makeColumnIsLoadingSelector,
  makeColumnSelector,
  makeColumnSubscriptionsSelector,
  makeDenormalizedOrderedColumnEventsSelector,
} from '../selectors'

import * as actionCreators from '../actions'
import type {
  ActionCreators,
  Column as ColumnType,
  GithubEvent,
  State,
} from '../utils/types'

const makeMapStateToProps = () => {
  const columnErrorsSelector = makeColumnErrorsSelector()
  const columnIsEmptySelector = makeColumnIsEmptySelector()
  const columnIsLoadingSelector = makeColumnIsLoadingSelector()
  const columnSelector = makeColumnSelector()
  const columnSubscriptionsSelector = makeColumnSubscriptionsSelector()
  const denormalizedOrderedColumnEventsSelector = makeDenormalizedOrderedColumnEventsSelector()

  return (state: State, { columnId }: { columnId: string }) => {
    const column = columnSelector(state, { columnId })
    const subscriptions = columnSubscriptionsSelector(state, { columnId })

    const hasOnlyOneRepository =
      subscriptions.size === 1 &&
      subscriptions.first().get('requestType') === requestTypes.REPO_EVENTS

    const icon =
      (subscriptions && subscriptions.size > 0
        ? getRequestTypeIcon(subscriptions.first().get('requestType'))
        : '') || 'mark-github'

    const updatedAt =
      subscriptions && subscriptions.size > 0
        ? subscriptions.first().get('updatedAt')
        : null

    return {
      column,
      errors: columnErrorsSelector(state, { columnId }),
      hasOnlyOneRepository,
      icon,
      events: denormalizedOrderedColumnEventsSelector(state, { columnId }),
      isEmpty: columnIsEmptySelector(state, { columnId }),
      loading: columnIsLoadingSelector(state, { columnId }),
      updatedAt,
    }
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
})

@connect(makeMapStateToProps, mapDispatchToProps)
export default class EventColumnContainer extends React.PureComponent {
  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors: Array<string>,
    events: Array<GithubEvent>,
    hasOnlyOneRepository: boolean,
    icon: boolean,
    isEmpty: boolean,
    loading: boolean,
    updatedAt: string,
  }

  render() {
    const {
      actions,
      column,
      errors,
      events,
      hasOnlyOneRepository,
      icon,
      isEmpty,
      loading,
      updatedAt,
    } = this.props

    if (!column) return null

    return (
      <EventColumn
        key={`event-column-${column.get('id')}`}
        actions={actions}
        column={column}
        errors={errors}
        hasOnlyOneRepository={hasOnlyOneRepository}
        icon={icon}
        isEmpty={isEmpty}
        items={events}
        loading={loading}
        updatedAt={updatedAt}
      />
    )
  }
}
