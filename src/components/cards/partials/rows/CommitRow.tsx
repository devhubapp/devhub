import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { tryGetUsernameFromGitHubEmail } from '../../../../utils/helpers/github/shared'
import {
  getGitHubSearchURL,
  getGitHubURLForUser,
} from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  authorEmail?: string
  authorName?: string
  authorUsername?: string
  isRead: boolean
  message: string
  url: string
}

export interface IState {}

const CommitRow: SFC<IProps> = ({
  authorEmail,
  authorName,
  authorUsername: _authorUsername,
  isRead,
  message: _message,
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
          onPress={getGithubURLPressHandler(url)}
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            <Icon name="git-commit" /> {message}
            {Boolean(byText) && (
              <Text
                style={[
                  cardStyles.normalText,
                  cardStyles.smallText,
                  cardStyles.mutedText,
                ]}
              >
                {` by ${byText}`}
              </Text>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommitRow
