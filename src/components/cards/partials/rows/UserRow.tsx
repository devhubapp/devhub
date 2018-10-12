import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import cardStyles from '../../styles'
import { getUserURL } from './helpers'
import rowStyles from './styles'

export interface UserRowProps {
  avatarURL: string
  isRead: boolean
  showMoreItemsIndicator?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

const UserRow: SFC<UserRowProps> = ({
  avatarURL,
  isRead,
  showMoreItemsIndicator,
  userLinkURL,
  username,
}) => (
  <View style={rowStyles.container}>
    <View style={cardStyles.leftColumn}>
      <Avatar
        avatarURL={avatarURL}
        isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
        linkURL={userLinkURL}
        small
        style={cardStyles.avatar}
        username={username}
      />
    </View>

    <View style={cardStyles.rightColumn}>
      <Link
        href={showMoreItemsIndicator ? undefined : getUserURL(username)}
        style={rowStyles.mainContentContainer}
      >
        <Text
          style={[
            rowStyles.usernameText,
            (isRead || showMoreItemsIndicator) && cardStyles.mutedText,
          ]}
        >
          {showMoreItemsIndicator ? '...' : username}
        </Text>
      </Link>
    </View>
  </View>
)

export default UserRow
