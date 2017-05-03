// @flow

import React from 'react';
import { Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationCard from '../components/cards/NotificationCard';

import {
  makeIsArchivedNotificationSelector,
  makeDenormalizedNotificationSelector,
  makeIsReadNotificationSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type { ActionCreators, GithubNotification, State } from '../utils/types';

const makeMapStateToProps = () => {
  const denormalizedNotificationSelector = makeDenormalizedNotificationSelector();
  const isArchivedNotificationSelector = makeIsArchivedNotificationSelector();
  const isReadNotificationSelector = makeIsReadNotificationSelector();

  return (
    state: State,
    {
      notificationOrNotificationId,
    }: { notificationOrNotificationId: string | GithubNotification },
  ) => {
    const notification = Iterable.isIterable(notificationOrNotificationId)
      ? notificationOrNotificationId
      : null;
    const notificationId = notification
      ? `${notification.get('id')}`
      : notificationOrNotificationId;

    return {
      archived: isArchivedNotificationSelector(state, { notificationId }),
      notification: notification ||
        denormalizedNotificationSelector(state, { notificationId }),
      read: isReadNotificationSelector(state, { notificationId }),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    notification?: GithubNotification,
    notificationOrNotificationId: string | GithubNotification,
    read: boolean,
  };

  render() {
    const { actions, notification, read, ...props } = this.props;

    if (!notification) return null;

    return (
      <NotificationCard
        key={`notification-card-${notification.get('id')}`}
        actions={actions}
        notification={notification}
        event={notification}
        read={read}
        {...props}
      />
    );
  }
}
