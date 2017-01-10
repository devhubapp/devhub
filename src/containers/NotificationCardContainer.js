// @flow

import React from 'react';
import { Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationCard from '../components/cards/NotificationCard';

import {
  makeArchivedNotificationSelector,
  makeDenormalizedNotificationSelector,
  makeReadNotificationSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  GithubNotification,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const archivedNotificationSelector = makeArchivedNotificationSelector();
  const denormalizedNotificationSelector = makeDenormalizedNotificationSelector();
  const readNotificationSelector = makeReadNotificationSelector();

  return (state: State, { notificationOrNotificationId }: { notificationOrNotificationId: string|GithubNotification }) => {
    const notification = Iterable.isIterable(notificationOrNotificationId) ? notificationOrNotificationId : null;
    const notificationId = notification ? `${notification.get('id')}` : notificationOrNotificationId;

    return {
      archived: archivedNotificationSelector(state, { notificationId }),
      notification: notification || denormalizedNotificationSelector(state, { notificationId }),
      read: readNotificationSelector(state, { notificationId }),
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

    return (
      <NotificationCard
        actions={actions}
        notification={notification}
        event={notification}
        read={read}
        {...props}
      />
    );
  }
}
