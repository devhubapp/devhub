// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationColumn from '../components/columns/NotificationColumn';

import {
  errorSelector,
  isLoadingSelector,
  updatedAtSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  Column as ColumnType,
  GithubNotification,
  Subscription,
  State,
} from '../utils/types';

const makeMapStateToProps = (state: State, { column }: { column: Object }) => ({
  errors: errorSelector(state) ? [errorSelector(state)] : null,
  loading: isLoadingSelector(state),
  items: column.get('notifications'),
  updatedAt: updatedAtSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors: Array<string>,
    items: Array<GithubNotification>,
    loading: boolean,
    subscriptions: Array<Subscription>,
  };

  render() {
    const {
      actions,
      column,
      errors,
      items,
      loading,
      ...props
    } = this.props;

    return (
      <NotificationColumn
        key={`notification-column-${column.get('id')}`}
        actions={actions}
        column={column}
        items={items}
        errors={errors}
        loading={loading}
        {...props}
      />
    );
  }
}
