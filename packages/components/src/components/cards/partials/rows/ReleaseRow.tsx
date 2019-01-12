import React from 'react'
import { View } from 'react-native'

import { getGitHubURLForRelease, trimNewLinesAndSpaces } from '@devhub/core'
import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { AnimatedIcon } from '../../../animated/AnimatedIcon'
import { AnimatedText } from '../../../animated/AnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { BranchRow } from './BranchRow'
import { getCardRowStylesForTheme } from './styles'

export interface ReleaseRowProps {
  avatarURL: string
  body: string
  branch?: string
  isRead: boolean
  name: string | undefined
  ownerName: string
  repositoryName: string
  smallLeftColumn?: boolean
  tagName: string | undefined
  url: string
  userLinkURL: string
  username: string
}

export interface ReleaseRowState {}

export const ReleaseRow = React.memo((props: ReleaseRowProps) => {
  const theme = useAnimatedTheme()

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

      {!!(name || tagName) && (
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
              <AnimatedText
                style={[
                  getCardStylesForTheme(theme).normalText,
                  isRead && getCardStylesForTheme(theme).mutedText,
                ]}
              >
                <AnimatedText numberOfLines={1}>
                  <AnimatedIcon
                    name="tag"
                    style={
                      isRead
                        ? getCardStylesForTheme(theme).mutedText
                        : getCardStylesForTheme(theme).normalText
                    }
                  />{' '}
                </AnimatedText>
                {name || tagName}
              </AnimatedText>
            </Link>
          </View>
        </View>
      )}

      {!!(body && body !== name && body !== tagName) && (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View
            style={[
              getCardStylesForTheme(theme).leftColumn,
              smallLeftColumn
                ? getCardStylesForTheme(theme).leftColumn__small
                : getCardStylesForTheme(theme).leftColumn__big,
              getCardStylesForTheme(theme).leftColumnAlignTop,
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
              <AnimatedText
                style={[
                  getCardStylesForTheme(theme).normalText,
                  isRead && getCardStylesForTheme(theme).mutedText,
                ]}
              >
                <AnimatedText numberOfLines={1}>
                  <AnimatedIcon
                    name="megaphone"
                    style={
                      isRead
                        ? getCardStylesForTheme(theme).mutedText
                        : getCardStylesForTheme(theme).normalText
                    }
                  />{' '}
                </AnimatedText>
                {body}
              </AnimatedText>
            </Link>
          </View>
        </View>
      )}
    </View>
  )
})
