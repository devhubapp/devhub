import React from 'react'
import { Text, View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core/src/utils/helpers/shared'
import { Platform } from '../../../../libs/platform'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { useTheme } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getCardRowStylesForTheme } from './styles'

export interface CommentRowProps {
  addBottomAnchor?: boolean
  avatarURL: string
  body: string
  isRead: boolean
  numberOfLines?: number
  smallLeftColumn?: boolean
  url?: string
  userLinkURL: string
  username: string
}

export interface CommentRowState {}

export function CommentRow(props: CommentRowProps) {
  const theme = useTheme()

  const {
    addBottomAnchor,
    avatarURL,
    body: _body,
    isRead,
    numberOfLines = 4,
    smallLeftColumn,
    url,
    userLinkURL,
    username,
  } = props

  const body = trimNewLinesAndSpaces(
    _body,
    Platform.select({ default: 400, web: 150 }),
  )
  if (!body) return null

  const isBot = Boolean(username && username.indexOf('[bot]') >= 0)

  return (
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
          href={fixURL(url, { addBottomAnchor })}
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
  )
}
