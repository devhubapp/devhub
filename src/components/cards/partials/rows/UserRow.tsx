import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getUserPressHandler } from './helpers'
import rowStyles from './styles'

export interface UserRowProperties {
  avatarURL: string
  isRead: boolean
  showMoreItemsIndicator?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

const UserRow: SFC<UserRowProperties> = ({
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
      <TouchableOpacity
        onPress={
          showMoreItemsIndicator ? undefined : getUserPressHandler(username)
        }
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
      </TouchableOpacity>
    </View>
  </View>
)

export default UserRow
