import React, { PureComponent } from 'react'

import RowList, { RenderItem } from './RowList'
import UserRow from './UserRow'

import { IGitHubUser, ITheme } from '../../../../types'

export interface UserListRowProps {
  isRead: boolean
  maxHeight?: number
  users: IGitHubUser[]
  theme: ITheme
}

export default class UserListRow extends PureComponent<UserListRowProps> {
  renderItem: RenderItem<IGitHubUser> = ({
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
