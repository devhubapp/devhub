import React from 'react'

import { GitHubUser, Omit } from '@devhub/core'
import { RenderItem, RowList } from './RowList'
import { UserRow, UserRowProps } from './UserRow'

export interface UserListRowProps
  extends Omit<
    UserRowProps,
    'avatarUrl' | 'showMoreItemsIndicator' | 'userLinkURL' | 'username'
  > {
  isRead: boolean
  maxHeight?: number
  users: GitHubUser[]
}

export const UserListRow = React.memo((props: UserListRowProps) => {
  const renderItem: RenderItem<GitHubUser> = ({
    item: user,
    index,
    showMoreItemsIndicator,
  }) => {
    if (!(user && user.id && user.login)) return null

    return (
      <UserRow
        key={`user-row-${user.id}`}
        {...props}
        avatarUrl={user.avatar_url}
        showMoreItemsIndicator={showMoreItemsIndicator}
        userLinkURL={user.html_url || ''}
        username={user.display_login || user.login}
        withTopMargin={index === 0 ? props.withTopMargin : true}
      />
    )
  }

  const { users, ...otherProps } = props

  if (!(users && users.length > 0)) return null

  return <RowList {...otherProps} data={users} renderItem={renderItem} />
})
