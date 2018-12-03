import React from 'react'
import { Text, View } from 'react-native'

import { tryGetUsernameFromGitHubEmail } from '@devhub/core/src/utils/helpers/github/shared'
import {
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
} from '@devhub/core/src/utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '@devhub/core/src/utils/helpers/shared'
import { Octicons as Icon } from '../../../../libs/vector-icons'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { useTheme } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getCardRowStylesForTheme } from './styles'

export interface CommitRowProps {
  authorEmail?: string
  authorName?: string
  authorUsername?: string
  isRead: boolean
  latestCommentUrl?: string
  message: string
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
  url: string
}

export interface CommitRowState {}

export function CommitRow(props: CommitRowProps) {
  const theme = useTheme()

  const {
    authorEmail,
    authorName,
    authorUsername: _authorUsername,
    isRead,
    latestCommentUrl,
    message: _message,
    showMoreItemsIndicator,
    smallLeftColumn,
    url,
  } = props

  const message = trimNewLinesAndSpaces(_message)
  if (!message) return null

  const authorUsername =
    _authorUsername || tryGetUsernameFromGitHubEmail(authorEmail)

  let byText = authorName
  if (authorUsername) byText += ` @${authorUsername}`
  else if (authorEmail)
    byText += byText ? ` <${authorEmail}>` : ` ${authorEmail}`
  byText = trimNewLinesAndSpaces(byText)

  return (
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
          email={authorEmail}
          isBot={Boolean(
            authorUsername && authorUsername.indexOf('[bot]') >= 0,
          )}
          small
          style={getCardStylesForTheme(theme).avatar}
          username={authorUsername}
          linkURL={
            authorUsername
              ? getGitHubURLForUser(authorUsername)
              : getGitHubSearchURL({ q: authorEmail || '', type: 'Users' })
          }
        />
      </View>

      <View style={getCardStylesForTheme(theme).rightColumn}>
        <Link
          href={
            showMoreItemsIndicator
              ? undefined
              : fixURL(url, {
                  commentId:
                    (latestCommentUrl &&
                      getCommentIdFromUrl(latestCommentUrl)) ||
                    undefined,
                })
          }
          style={getCardRowStylesForTheme(theme).mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[
              getCardStylesForTheme(theme).normalText,
              isRead && getCardStylesForTheme(theme).mutedText,
            ]}
          >
            <Icon name="git-commit" /> {showMoreItemsIndicator ? '' : message}
            {Boolean(byText) && (
              <Text
                style={[
                  getCardStylesForTheme(theme).normalText,
                  getCardStylesForTheme(theme).smallText,
                  getCardStylesForTheme(theme).mutedText,
                ]}
              >
                {showMoreItemsIndicator ? '...' : ` by ${byText}`}
              </Text>
            )}
          </Text>
        </Link>
      </View>
    </View>
  )
}
