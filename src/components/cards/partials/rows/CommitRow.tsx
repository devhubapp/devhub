import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { tryGetUsernameFromGitHubEmail } from '../../../../utils/helpers/github/shared'
import {
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
} from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface CommitRowProperties {
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

const CommitRow: SFC<CommitRowProperties> = ({
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
          username={authorUsername}
          small
          style={cardStyles.avatar}
          linkURL={
            authorUsername
              ? getGitHubURLForUser(authorUsername)
              : getGitHubSearchURL({ q: authorEmail || '', type: 'Users' })
          }
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={
            showMoreItemsIndicator
              ? undefined
              : getGithubURLPressHandler(url, {
                  commentId:
                    latestCommentUrl && getCommentIdFromUrl(latestCommentUrl),
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
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommitRow
