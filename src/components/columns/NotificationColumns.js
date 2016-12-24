// @flow

import React from 'react';
import { List } from 'immutable';

import Columns from './_Columns';
import NotificationColumn from './NotificationColumn';
import { radius } from '../../styles/variables';
import type { ActionCreators, Column as ColumnType } from '../../utils/types';

export default class extends React.PureComponent {
  props: {
    actions: ActionCreators,
    columns: Array<ColumnType>,
    updatedAt: Date,
  };

  renderRow = (column) => {
    const { updatedAt } = this.props;

    if (!column) return null;

    const columnId = column.get('id');
    if (!columnId) return null;

    const items = column.get('notifications');
    if (!items) return null;

    return (
      <NotificationColumn
        key={`notification-column-${columnId}`}
        column={column}
        items={items}
        radius={radius}
        updatedAt={updatedAt}
      />
    );
  };

  render() {
    const { columns = List(), ...props } = this.props;

    return (
      <Columns
        key="notification-columns"
        columns={columns}
        renderRow={this.renderRow}
        {...props}
      />
    );
  }
}
