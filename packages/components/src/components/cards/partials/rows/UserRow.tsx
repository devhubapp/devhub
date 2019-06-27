import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForUser } from '@devhub/core'
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
  muted: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

export const UserRow = React.memo((props: UserRowProps) => {
  const {
    avatarUrl,
    bold,
    // hideIcon,
    muted,
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
          muted={muted}
          small
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            href={getGitHubURLForUser(username)}
            textProps={{
              color: muted ? 'foregroundColorMuted60' : 'foregroundColor',
              style: [bold && cardStyles.boldText],
            }}
          >
            {username}
          </Link>
        </View>
      }
    />
  )
})

UserRow.displayName = 'UserRow'
