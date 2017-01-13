// @flow

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NotificationsFilterColumn from '../components/columns/NotificationsFilterColumn';

import * as actionCreators from '../actions';

import {
  errorSelector,
  filterColumnDataSelector,
  isLoadingSelector,
  updatedAtSelector,
} from '../selectors/notifications';

import type { State } from '../utils/types';

const makeMapStateToProps = (state: State) => ({
  errors: errorSelector(state) ? [errorSelector(state)] : null,
  loading: isLoadingSelector(state),
  items: filterColumnDataSelector(state),
  updatedAt: updatedAtSelector(state),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actionCreators, dispatch),
});

@connect(makeMapStateToProps, mapDispatchToProps)
export default class extends React.PureComponent {
  props: {
    column: Object,
    loading: boolean,
    items: Object,
    updatedAt: Date,
  };

  render() {
    const { column, items, ...props } = this.props;

    return (
      <NotificationsFilterColumn
        key="notifications-filter-column"
        column={column}
        items={items}
        {...props}
      />
    );
  }
}
