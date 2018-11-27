import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { EnhancedGitHubEvent } from 'shared-core/dist/types'
import { Octicons as Icon } from '../../../../libs/vector-icons'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getBranchURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

export interface BranchRowProps {
  branch: string
  isBranchMainEvent: boolean
  isRead: boolean
  ownerName: string
  repositoryName: string
  smallLeftColumn?: boolean
}

export interface BranchRowState {}

export const BranchRow: SFC<BranchRowProps> = ({
  branch: _branch,
  isBranchMainEvent,
  isRead,
  ownerName,
  repositoryName,
  smallLeftColumn,
}) => {
  const branch = (_branch || '').replace('refs/heads/', '')
  if (!branch) return null

  if (branch === 'master' && !isBranchMainEvent) return null

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View
            style={[
              getCardStylesForTheme(theme).leftColumn,
              smallLeftColumn
                ? getCardStylesForTheme(theme).leftColumn__small
                : getCardStylesForTheme(theme).leftColumn__big,
            ]}
          >
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
                  (isRead || !isBranchMainEvent) &&
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
