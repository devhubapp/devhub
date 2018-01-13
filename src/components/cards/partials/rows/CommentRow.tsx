import React, { SFC } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import { IGitHubEventType } from '../../../../types'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  body: string
  isRead?: boolean
  numberOfLines?: number
  username: string
  type: IGitHubEventType
  url?: string
}

export interface IState {}

const CommentRow: SFC<IProps> = ({
  body: _body,
  isRead,
  numberOfLines = 4,
  url,
  username,
}) => {
  const body = trimNewLinesAndSpaces(_body, 400)
  if (!body) return null

  return (
    <View style={rowStyles.container}>
      <View style={[cardStyles.leftColumn, cardStyles.leftColumnAlignTop]}>
        <Avatar username={username} small style={cardStyles.avatar} />
      </View>

      <View style={cardStyles.rightColumn}>
        <TouchableOpacity
          onPress={getGithubURLPressHandler(url)}
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={numberOfLines}
            style={[cardStyles.normalText, isRead && cardStyles.mutedText]}
          >
            {body}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CommentRow
