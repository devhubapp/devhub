// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationColumns from '../components/columns/NotificationColumns';
import { denormalizedGroupedNotificationsSelector, updatedAtSelector } from '../selectors';
import * as actionCreators from '../actions';
import type { ActionCreators, State } from '../utils/types';

const mapStateToProps = (state: State) => ({
  columns: denormalizedGroupedNotificationsSelector(state),
  updatedAt: updatedAtSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Object,
    updatedAt: Date,
  };

  render() {
    const { actions, columns, updatedAt, ...props } = this.props;

    return (
      <NotificationColumns
        key="notification-columns-container"
        actions={actions}
        columns={columns}
        updatedAt={updatedAt}
        {...props}
      />
    );
  }
}
