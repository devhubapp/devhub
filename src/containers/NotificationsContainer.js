// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Notifications from '../components/Notifications';
import { denormalizedNotificationsSelector } from '../selectors';
import * as actionCreators from '../actions';
import type { ActionCreators, GithubNotification, State } from '../utils/types';

const mapStateToProps = (state: State) => ({
  notifications: denormalizedNotificationsSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    notifications: Array<GithubNotification>,
  };

  render() {
    const { actions, notifications, ...props } = this.props;

    return (
      <Notifications
        key="notifications-container"
        actions={actions}
        notifications={notifications}
        {...props}
      />
    );
  }
}
