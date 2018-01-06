import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getRepositoryPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  repository: string
  owner: string
}

export interface IState {}

const RepositoryRow: SFC<IProps> = ({ owner, repository }) => (
  <View style={rowStyles.container}>
    <View style={cardStyles.leftColumn}>
      <Avatar username={owner} small style={cardStyles.avatar} />
    </View>

    <View style={cardStyles.rightColumn}>
      <TouchableOpacity
        onPress={getRepositoryPressHandler(owner, repository)}
        style={rowStyles.mainContentContainer}
      >
        <Text style={rowStyles.repositoryText}>{repository}</Text>
        <Text style={rowStyles.repositorySecondaryText}>&nbsp;{owner}</Text>
      </TouchableOpacity>
    </View>
  </View>
)

export default RepositoryRow
