// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import debounce from '../utils/hoc/debounce';
import NotificationColumn from '../components/columns/NotificationColumn';

import {
  notificationsErrorSelector,
  notificationsIsLoadingSelector,
  makeRepoSelector,
  notificationsUpdatedAtSelector,
} from '../selectors';

import * as actionCreators from '../actions';

import type {
  ActionCreators,
  Column as ColumnType,
  GithubNotification,
  GithubRepo,
  State,
} from '../utils/types';

const makeMapStateToProps = (state: State, { column }: { column: Object }) => {
  const repoSelector = makeRepoSelector();

  return ({
    errors: notificationsErrorSelector(state) ? [notificationsErrorSelector(state)] : null,
    loading: notificationsIsLoadingSelector(state),
    items: column.get('notifications') || column.get('notificationIds'),
    repo: repoSelector(state, { repoId: column.get('repoId') }),
    updatedAt: notificationsUpdatedAtSelector(state),
  });
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
@debounce(50)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    column: ColumnType,
    errors: Array<string>,
    items: Array<string | GithubNotification>,
    loading: boolean,
    repo?: GithubRepo,
  };

  render() {
    const {
      actions,
      column,
      errors,
      items,
      loading,
      repo,
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
        repo={repo}
        {...props}
      />
    );
  }
}
