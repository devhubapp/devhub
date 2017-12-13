import React from 'react'
import { Text, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import rowStyles from './styles'

export interface IProps {
  repository: string
  owner: string
}

export interface IState {}

const RepositoryRow = ({ owner, repository }: IProps) => (
  <View style={rowStyles.container}>
    <View style={cardStyles.leftColumn}>
      <Avatar username={owner} small style={cardStyles.avatar} />
    </View>

    <View style={cardStyles.rightColumn}>
      <View style={rowStyles.mainContentContainer}>
        <Text style={rowStyles.repositoryText}>{repository}</Text>
        <Text style={rowStyles.ownerText}>&nbsp;{owner}</Text>
      </View>
    </View>
  </View>
)

export default RepositoryRow
