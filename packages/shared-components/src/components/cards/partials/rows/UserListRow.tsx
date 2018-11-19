import React, { PureComponent } from 'react'

import { RenderItem, RowList } from './RowList'
import { UserRow } from './UserRow'

import { GitHubUser } from 'shared-core/dist/types'

export interface UserListRowProps {
  isRead: boolean
  maxHeight?: number
  users: GitHubUser[]
}

export class UserListRow extends PureComponent<UserListRowProps> {
  renderItem: RenderItem<GitHubUser> = ({
    item: user,
    showMoreItemsIndicator,
  }) => {
    if (!(user && user.id && user.login)) return null

    return (
      <UserRow
        key={`user-row-${user.id}`}
        {...this.props}
        avatarURL={user.avatar_url}
        showMoreItemsIndicator={showMoreItemsIndicator}
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
