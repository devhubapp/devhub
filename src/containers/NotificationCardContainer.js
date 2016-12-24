// @flow

import React from 'react';
import { Iterable } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationCard from '../components/cards/NotificationCard';

import {
  makeDenormalizedNotificationSelector,
  makeSeenNotificationSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type {
  ActionCreators,
  GithubNotification,
  State,
} from '../utils/types';

const makeMapStateToProps = () => {
  const denormalizedNotificationSelector = makeDenormalizedNotificationSelector();
  const seenNotificationSelector = makeSeenNotificationSelector();

  return (state: State, { notificationOrNotificationId }: { notificationOrNotificationId: string|GithubNotification }) => {
    const notification = Iterable.isIterable(notificationOrNotificationId) ? notificationOrNotificationId : null;
    const notificationId = notification ? `${notification.get('id')}` : notificationOrNotificationId;

    return {
      notification: notification || denormalizedNotificationSelector(state, { notificationId }),
      seen: seenNotificationSelector(state, { notificationId }),
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
    seen: boolean,
  };

  render() {
    const { actions, notification, seen, ...props } = this.props;

    return (
      <NotificationCard
        actions={actions}
        notification={notification}
        event={notification}
        seen={seen}
        {...props}
      />
    );
  }
}
