// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Column from '../components/Column';

import {
  columnIsLoadingSelector,
  columnErrorsSelector,
  makeColumnSelector,
  makeColumnSubscriptionsSelector,
  makeDenormalizedColumnEventsSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  Column as ColumnType,
  GithubEvent,
  Subscription,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const columnSelector = makeColumnSelector();
  const columnSubscriptionsSelector = makeColumnSubscriptionsSelector();
  const denormalizedColumnEventsSelector = makeDenormalizedColumnEventsSelector();

  return (state: State, { columnId }: { columnId: string }) => ({
    column: columnSelector(state, { columnId }),
    errors: columnErrorsSelector(state, { columnId }),
    events: denormalizedColumnEventsSelector(state, { columnId }),
    subscriptions: columnSubscriptionsSelector(state, { columnId }),
    loading: columnIsLoadingSelector(state, { columnId }),
  });
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors: Array<string>,
    events: Array<GithubEvent>,
    loading: boolean,
    subscriptions: Array<Subscription>,
  };

  render() {
    const {
      actions,
      column,
      errors,
      events,
      loading,
      subscriptions,
      ...props
    } = this.props;

    return (
      <Column
        key={`column-container-${column.get('id')}`}
        actions={actions}
        column={column}
        events={events}
        errors={errors}
        loading={loading}
        subscriptions={subscriptions}
        {...props}
      />
    );
  }
}
