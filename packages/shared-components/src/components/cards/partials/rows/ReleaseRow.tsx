import React from 'react'
import { Text, View } from 'react-native'

import { getGitHubURLForRelease } from 'shared-core/dist/utils/helpers/github/url'
import { trimNewLinesAndSpaces } from 'shared-core/dist/utils/helpers/shared'
import { Octicons as Icon } from '../../../../libs/vector-icons'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { useTheme } from '../../../context/ThemeContext'
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
  url: string
  userLinkURL: string
  username: string
}

export interface ReleaseRowState {}

export function ReleaseRow(props: ReleaseRowProps) {
  const theme = useTheme()

  const {
    avatarURL,
    body: _body,
    branch,
    isRead,
    name: _name,
    ownerName,
    repositoryName,
    smallLeftColumn,
    tagName: _tagName,
    url,
    userLinkURL,
    username,
  } = props

  const body = trimNewLinesAndSpaces(_body)
  const name = trimNewLinesAndSpaces(_name)
  const tagName = trimNewLinesAndSpaces(_tagName)

  const repoFullName =
    ownerName && repositoryName ? `${ownerName}/${repositoryName}` : ''
  const fixedURL = fixURL(
    url && !url.includes('api.')
      ? url
      : getGitHubURLForRelease(repoFullName, tagName),
  )

  return (
    <View>
      {!!branch && (
        <BranchRow
          key={`branch-row-${branch}`}
          branch={branch}
          isBranchMainEvent={false}
          isRead={isRead}
          ownerName={ownerName || ''}
          repositoryName={repositoryName || ''}
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
            href={fixedURL}
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

      {!!(body && body !== name && body !== tagName) && (
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
              href={fixedURL}
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
      )}
    </View>
  )
}
