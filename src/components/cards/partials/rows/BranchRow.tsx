import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { IEnhancedGitHubEvent } from '../../../../types'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import cardStyles from '../../styles'
import { getBranchURL } from './helpers'
import rowStyles from './styles'

export interface IProps {
  branch: string
  isRead: boolean
  ownerName: string
  repositoryName: string
  type: IEnhancedGitHubEvent['type']
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
        <Avatar
          isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
          linkURL=""
          small
          style={cardStyles.avatar}
          username={ownerName}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          href={getBranchURL(ownerName, repositoryName, branch)}
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
        </Link>
      </View>
    </View>
  )
}

export default BranchRow
