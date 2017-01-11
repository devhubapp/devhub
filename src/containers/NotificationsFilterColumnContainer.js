// @flow

import React from 'react';
import { connect } from 'react-redux';

import NotificationsFilterColumn from '../components/columns/NotificationsFilterColumn';

import {
  denormalizedOrderedNotificationsSelector,
} from '../selectors';

import { notificationsToFilterColumnData } from '../utils/helpers';
import type { State } from '../utils/types';

const makeMapStateToProps = (state: State) => ({
  items: notificationsToFilterColumnData(denormalizedOrderedNotificationsSelector(state)),
});

@connect(makeMapStateToProps)
export default class extends React.PureComponent {
  props: {
    column: Object,
    items: Object,
  };

  render() {
    const { column, items, ...props } = this.props;

    return (
      <NotificationsFilterColumn
        key={`notifications-filter-column}`}
        column={column}
        items={items}
        {...props}
      />
    );
  }
}
