// @flow

import React from 'react'

import UserRow from './_UserRow'
import RowList from './__RowList'

import type { User } from '../../utils/types'

export default class UserListRow extends React.PureComponent {
  props: {
    users: Array<User>,
    maxHeight?: number,
  }

  makeRenderItem = (passProps = {}) => ({ item: user }) =>
    Boolean(user) && (
      <UserRow
        key={`user-row-${user.get('id')}`}
        user={user}
        narrow
        {...passProps}
      />
    )

  render() {
    const { maxHeight, users, ...props } = this.props

    if (!(users && users.size > 0)) return null

    return (
      <RowList
        data={users}
        maxHeight={maxHeight}
        renderItem={this.makeRenderItem(props)}
        {...props}
      />
    )
  }
}
