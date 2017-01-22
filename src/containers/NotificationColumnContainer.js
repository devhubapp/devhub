// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { OrderedSet } from 'immutable';

import NotificationColumn from '../components/columns/NotificationColumn';

import {
  notificationsErrorSelector,
  notificationsIsLoadingSelector,
  makeRepoSelector,
  notificationsUpdatedAtSelector,
  unarchivedNotificationIdsSelector,
} from '../selectors';

import * as actionCreators from '../actions';

import type {
  ActionCreators,
  Column as ColumnType,
  GithubNotification,
  GithubRepo,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const repoSelector = makeRepoSelector();

  return (state: State, { column }: {column: Object}) => {
    const _items = column.get('notificationIds').toList();

    // This is not very intuitive, but works. This code is here because
    // the notifications columns are only being generated once.
    // This means that, even after clearing the column items,
    // column.get('notificationIds') will have the same initial value,
    // so we update it here ignoring the archived ones.
    // (otherwise, the empty message would not show up)
    const unarchivedIds = unarchivedNotificationIdsSelector(state);
    const items = OrderedSet(_items).intersect(unarchivedIds).toList();

    return {
      errors: [notificationsErrorSelector(state)],
      loading: notificationsIsLoadingSelector(state),
      isEmpty: items.size === 0,
      items,
      repo: column.get('repo') ||
        repoSelector(state, { repoId: column.get('repoId') }),
      updatedAt: notificationsUpdatedAtSelector(state),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  static defaultProps = { repo: undefined };

  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors: Array<string>,
    items: Array<string | GithubNotification>,
    loading: boolean,
    repo?: GithubRepo
  };

  render() {
    const { column, ...props } = this.props;

    if (!column) return null;

    return (
      <NotificationColumn
        {...props}
        key={`notification-column-${column.get('id')}`}
        column={column}
      />
    );
  }
}
