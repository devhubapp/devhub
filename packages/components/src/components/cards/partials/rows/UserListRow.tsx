import React from 'react'

import { GitHubUser } from '@devhub/core'
import { RenderItem, RowList } from './RowList'
import { UserRow } from './UserRow'

export interface UserListRowProps {
  isRead: boolean
  maxHeight?: number
  smallLeftColumn?: boolean
  users: GitHubUser[]
}

export const UserListRow = React.memo((props: UserListRowProps) => {
  const renderItem: RenderItem<GitHubUser> = ({
    item: user,
    showMoreItemsIndicator,
  }) => {
    if (!(user && user.id && user.login)) return null

    return (
      <UserRow
        key={`user-row-${user.id}`}
        {...props}
        avatarURL={user.avatar_url}
        showMoreItemsIndicator={showMoreItemsIndicator}
        userLinkURL={user.html_url || ''}
        username={user.display_login || user.login}
      />
    )
  }

  const { users, ...otherProps } = props

  if (!(users && users.length > 0)) return null

  return <RowList {...otherProps} data={users} renderItem={renderItem} />
})
