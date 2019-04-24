import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForUser, Omit } from '@devhub/core'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface UserRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  avatarUrl: string
  bold?: boolean
  // hideIcon?: boolean
  isRead: boolean
  showMoreItemsIndicator?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

export const UserRow = React.memo((props: UserRowProps) => {
  const {
    avatarUrl,
    bold,
    // hideIcon,
    isRead,
    showMoreItemsIndicator,
    userLinkURL,
    username,
    ...otherProps
  } = props

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          avatarUrl={avatarUrl}
          isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
          linkURL={userLinkURL}
          small
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            href={
              showMoreItemsIndicator ? undefined : getGitHubURLForUser(username)
            }
            textProps={{
              color:
                isRead || showMoreItemsIndicator
                  ? 'foregroundColorMuted50'
                  : 'foregroundColor',
              style: [bold && !isRead && cardStyles.boldText],
            }}
          >
            {showMoreItemsIndicator ? '...' : username}
          </Link>
        </View>
      }
    />
  )
})
