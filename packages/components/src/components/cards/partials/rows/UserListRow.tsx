import _ from 'lodash'
import React from 'react'

import { GitHubUser } from '@devhub/core'
import { RenderItem, RowList, RowListProps, rowListProps } from './RowList'
import { UserRow, UserRowProps } from './UserRow'

interface ListProps extends Omit<RowListProps<GitHubUser>, 'renderItem'> {}
interface ItemProps
  extends Omit<UserRowProps, 'avatarUrl' | 'userLinkURL' | 'username'> {}

export interface UserListRowProps extends ListProps, ItemProps {}

export const UserListRow = React.memo((_props: UserListRowProps) => {
  const listProps = _.pick(_props, rowListProps) as ListProps
  const itemProps = _.omit(_props, rowListProps) as ItemProps

  const renderItem: RenderItem<GitHubUser> = ({ item: user, index }) => {
    if (!(user && user.id && user.login)) return null

    return (
      <UserRow
        key={`user-row-${user.id}`}
        {...itemProps}
        avatarUrl={user.avatar_url}
        userLinkURL={user.html_url || ''}
        username={user.display_login || user.login}
        withTopMargin={index === 0 ? itemProps.withTopMargin : true}
      />
    )
  }

  return <RowList {...listProps} renderItem={renderItem} />
})
