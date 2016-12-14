// @flow

import React from 'react';

import UserRow from './_UserRow';
import RowList from './__RowList';

import type { User } from '../../utils/types';

export default class extends React.PureComponent {
  renderRow = (passProps = {}) => user => (
    <UserRow
      key={`user-row-${user.get('id')}`}
      user={user}
      narrow
      {...passProps}
    />
  );

  props: {
    users: Array<User>,
    maxHeight?: number,
  };

  render() {
    const { maxHeight, users, ...props } = this.props;

    if (!(users && users.size > 0)) return null;

    return (
      <RowList data={users} maxHeight={maxHeight} renderRow={this.renderRow(props)} {...props} />
    );
  }
}
