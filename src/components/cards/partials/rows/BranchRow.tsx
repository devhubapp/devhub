import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { IGitHubEventType } from '../../../../types'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getBranchPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  branch: string
  isRead: boolean
  ownerName: string
  repositoryName: string
  type: IGitHubEventType
}

export interface IState {}

const BranchRow: SFC<IProps> = ({
  branch: _branch,
  isRead,
  ownerName,
  repositoryName,
  type,
}) => {
  const branch = (_branch || '').replace('refs/heads/', '')
  if (!branch) return null

  const isBranchMainEventAction =
    type === 'CreateEvent' || type === 'DeleteEvent'
  if (branch === 'master' && !isBranchMainEventAction) return null

  return (
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn}>
        <Avatar username={ownerName} small style={cardStyles.avatar} />
      </View>

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={getBranchPressHandler(ownerName, repositoryName, branch)}
          style={rowStyles.mainContentContainer}
        >
          <Text
            style={[
              cardStyles.normalText,
              (isRead || !isBranchMainEventAction) && cardStyles.mutedText,
            ]}
          >
            <Text
              numberOfLines={1}
              style={isRead ? cardStyles.mutedText : cardStyles.normalText}
            >
              <Icon name="git-branch" />{' '}
            </Text>
            {branch}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BranchRow
