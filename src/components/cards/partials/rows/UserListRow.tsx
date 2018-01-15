import React, { PureComponent } from 'react'

import RowList from './RowList'
import UserRow from './UserRow'

import { IGitHubUser, ITheme } from '../../../../types'

export interface IProps {
  isRead: boolean
  maxHeight?: number
  users: IGitHubUser[]
  theme: ITheme
}

export default class UserListRow extends PureComponent<IProps> {
  renderItem = ({ item: user }: { item: IGitHubUser }) => {
    if (!(user && user.id && user.login)) return null

    return (
      <UserRow
        key={`user-row-${user.id}`}
        {...this.props}
        avatarURL={user.avatar_url}
        userLinkURL={user.html_url || ''}
        username={user.display_login || user.login}
      />
    )
  }

  render() {
    const { users, ...props } = this.props

    if (!(users && users.length > 0)) return null

    return <RowList {...props} data={users} renderItem={this.renderItem} />
  }
}
