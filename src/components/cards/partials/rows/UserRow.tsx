import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getUserPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  avatarURL: string
  isRead: boolean
  username: string
  userLinkURL: string
}

export interface IState {}

const UserRow: SFC<IProps> = ({ avatarURL, isRead, username, userLinkURL }) => (
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
        onPress={getUserPressHandler(username)}
        style={rowStyles.mainContentContainer}
      >
        <Text style={[rowStyles.usernameText, isRead && cardStyles.mutedText]}>
          {username}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default UserRow
