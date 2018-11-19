import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { EnhancedGitHubEvent } from 'shared-core/dist/types'
import { trimNewLinesAndSpaces } from 'shared-core/dist/utils/helpers/shared'
import { Octicons as Icon } from '../../../../libs/vector-icons'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { BranchRow } from './BranchRow'
import { getCardRowStylesForTheme } from './styles'

export interface ReleaseRowProps {
  avatarURL: string
  body: string
  branch?: string
  isRead: boolean
  name: string
  ownerName: string
  repositoryName: string
  smallLeftColumn?: boolean
  tagName: string
  type: EnhancedGitHubEvent['type']
  url: string
  userLinkURL: string
  username: string
}

export interface ReleaseRowState {}

export const ReleaseRow: SFC<ReleaseRowProps> = ({
  avatarURL,
  body: _body,
  branch,
  isRead,
  name: _name,
  ownerName,
  repositoryName,
  smallLeftColumn,
  tagName: _tagName,
  type,
  url,
  userLinkURL,
  username,
}) => {
  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View>
          {!!(branch && ownerName && repositoryName) && (
            <BranchRow
              key={`branch-row-${branch}`}
              branch={branch}
              ownerName={ownerName!}
              repositoryName={repositoryName!}
              type={type}
              isRead={isRead}
            />
          )}

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
                href={fixURL(url)}
                style={getCardRowStylesForTheme(theme).mainContentContainer}
              >
                <Text
                  style={[
                    getCardStylesForTheme(theme).normalText,
                    isRead && getCardStylesForTheme(theme).mutedText,
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
                    <Icon name="tag" />{' '}
                  </Text>
                  {name || tagName}
                </Text>
              </Link>
            </View>
          </View>

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
                avatarURL={avatarURL}
                isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
                linkURL={userLinkURL}
                small
                style={getCardStylesForTheme(theme).avatar}
                username={username}
              />
            </View>

            <View style={getCardStylesForTheme(theme).rightColumn}>
              <Link
                href={fixURL(url)}
                style={getCardRowStylesForTheme(theme).mainContentContainer}
              >
                <Text
                  style={[
                    getCardStylesForTheme(theme).normalText,
                    isRead && getCardStylesForTheme(theme).mutedText,
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
                    <Icon name="megaphone" />{' '}
                  </Text>
                  {body}
                </Text>
              </Link>
            </View>
          </View>
        </View>
      )}
    </ThemeConsumer>
  )
}
