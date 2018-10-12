import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import { tryGetUsernameFromGitHubEmail } from '../../../../utils/helpers/github/shared'
import {
  fixURL,
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
} from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import cardStyles from '../../styles'
import rowStyles from './styles'

export interface CommitRowProps {
  authorEmail?: string
  authorName?: string
  authorUsername?: string
  isRead: boolean
  latestCommentUrl?: string
  message: string
  showMoreItemsIndicator?: boolean
  url: string
}

export interface CommitRowState {}

const CommitRow: SFC<CommitRowProps> = ({
  authorEmail,
  authorName,
  authorUsername: _authorUsername,
  isRead,
  latestCommentUrl,
  message: _message,
  showMoreItemsIndicator,
  url,
}) => {
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
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn}>
        <Avatar
          email={authorEmail}
          isBot={Boolean(
            authorUsername && authorUsername.indexOf('[bot]') >= 0,
          )}
          small
          style={cardStyles.avatar}
          username={authorUsername}
          linkURL={
            authorUsername
              ? getGitHubURLForUser(authorUsername)
              : getGitHubSearchURL({ q: authorEmail || '', type: 'Users' })
          }
        />
      </View>

      <View style={cardStyles.rightColumn}>
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
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            <Icon name="git-commit" /> {showMoreItemsIndicator ? '' : message}
            {Boolean(byText) && (
              <Text
                style={[
                  cardStyles.normalText,
                  cardStyles.smallText,
                  cardStyles.mutedText,
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

export default CommitRow
