import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import Platform from '../../../../libs/platform'
import { fixURL } from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getCardRowStylesForTheme } from './styles'

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
    <ThemeConsumer>
      {({ theme }) => (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View
            style={[
              getCardStylesForTheme(theme).leftColumn,
              getCardStylesForTheme(theme).leftColumnAlignTop,
            ]}
          >
            <Avatar
              avatarURL={avatarURL}
              isBot={isBot}
              linkURL={userLinkURL}
              shape={isBot ? 'rounded' : undefined}
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
                numberOfLines={numberOfLines}
                style={[
                  getCardStylesForTheme(theme).commentText,
                  isRead && getCardStylesForTheme(theme).mutedText,
                ]}
              >
                {body}
              </Text>
            </Link>
          </View>
        </View>
      )}
    </ThemeConsumer>
  )
}

export default CommentRow
