import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getUserPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  isRead?: boolean
  username: string
}

export interface IState {}

const UserRow: SFC<IProps> = ({ isRead, username }) => (
  <View style={rowStyles.container}>
    <View style={cardStyles.leftColumn}>
      <Avatar username={username} small style={cardStyles.avatar} />
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
