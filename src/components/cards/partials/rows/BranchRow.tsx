import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { IEnhancedGitHubEvent } from '../../../../types'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getBranchURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

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
    <ThemeConsumer>
      {({ theme }) => (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View style={getCardStylesForTheme(theme).leftColumn}>
            <Avatar
              isBot={Boolean(ownerName && ownerName.indexOf('[bot]') >= 0)}
              linkURL=""
              small
              style={getCardStylesForTheme(theme).avatar}
              username={ownerName}
            />
          </View>

          <View style={getCardStylesForTheme(theme).rightColumn}>
            <Link
              href={getBranchURL(ownerName, repositoryName, branch)}
              style={getCardRowStylesForTheme(theme).mainContentContainer}
            >
              <Text
                style={[
                  getCardStylesForTheme(theme).normalText,
                  (isRead || !isBranchMainEventAction) &&
                    getCardStylesForTheme(theme).mutedText,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={
                    isRead
                      ? getCardStylesForTheme(theme).mutedText
                      : getCardStylesForTheme(theme).normalText
                  }
                >
                  <Icon name="git-branch" />{' '}
                </Text>
                {branch}
              </Text>
            </Link>
          </View>
        </View>
      )}
    </ThemeConsumer>
  )
}

export default BranchRow
