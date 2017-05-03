// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';

import NotificationsFilterColumn
  from '../components/columns/NotificationsFilterColumn';

import * as actionCreators from '../actions';

import {
  notificationsToFilterColumnData,
} from '../utils/helpers/github/notifications';

import {
  notificationsErrorSelector,
  makeDenormalizedNotificationsSelector,
  notificationsIsLoadingSelector,
  notificationsUpdatedAtSelector,
} from '../selectors/notifications';

import type { State } from '../utils/types';

const makeMapStateToProps = (
  state: State,
  { column, updatedAt }: { column: Object, updatedAt?: Date },
) => {
  const denormalizedNotificationsSelector = makeDenormalizedNotificationsSelector();

  const notifications = denormalizedNotificationsSelector(state, {
    notificationIds: column.get('notificationIds') ||
      (column.get('notifications') || Map()).map(n => n.get('id')).toList(),
  });

  return {
    errors: [notificationsErrorSelector(state)],
    loading: notificationsIsLoadingSelector(state),
    items: notificationsToFilterColumnData(notifications),
    updatedAt: typeof updatedAt === 'undefined'
      ? notificationsUpdatedAtSelector(state)
      : updatedAt,
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: { column: Object, loading: boolean, items: Object, updatedAt: Date };

  render() {
    const { items, ...props } = this.props;

    return (
      <NotificationsFilterColumn
        {...props}
        key="notifications-filter-column"
        items={items}
      />
    );
  }
}
