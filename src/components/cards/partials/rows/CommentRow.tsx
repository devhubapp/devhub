import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import Platform from '../../../../libs/platform'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  avatarURL: string
  body: string
  isRead: boolean
  numberOfLines?: number
  url?: string
  userLinkURL: string
  username: string
}

export interface IState {}

const CommentRow: SFC<IProps> = ({
  avatarURL,
  body: _body,
  isRead,
  numberOfLines = 4,
  url,
  username,
  userLinkURL,
}) => {
  const body = trimNewLinesAndSpaces(
    _body,
    Platform.select({ default: 400, web: 150 }),
  )
  if (!body) return null

  const isBot = Boolean(username && username.indexOf('[bot]') >= 0)

  return (
    <View style={rowStyles.container}>
      <View style={[cardStyles.leftColumn, cardStyles.leftColumnAlignTop]}>
        <Avatar
          avatarURL={avatarURL}
          isBot={isBot}
          linkURL={userLinkURL}
          shape={isBot ? 'rounded' : undefined}
          small
          style={cardStyles.avatar}
          username={username}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={getGithubURLPressHandler(url)}
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={numberOfLines}
            style={[cardStyles.commentText, isRead && cardStyles.mutedText]}
          >
            {body}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommentRow
