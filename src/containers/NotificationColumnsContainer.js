// @flow

import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import NotificationColumns from '../components/columns/NotificationColumns';

import {
  denormalizedGroupedNotificationsSelector,
} from '../selectors';

import * as actionCreators from '../actions';
import type { ActionCreators, State } from '../utils/types';

const denormalizedGNSelectorParams = { includeAllGroup: true };
const mapStateToProps = (state: State) => ({
  columns: denormalizedGroupedNotificationsSelector(state, denormalizedGNSelectorParams),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Object,
  };

  render() {
    const { actions, columns, ...props } = this.props;

    return (
      <NotificationColumns
        key="notification-columns"
        actions={actions}
        columns={columns}
        {...props}
      />
    );
  }
}
