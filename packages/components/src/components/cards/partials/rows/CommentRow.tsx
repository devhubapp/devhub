import React from 'react'
import { View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { cardRowStyles } from './styles'

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

export const CommentRow = React.memo((props: CommentRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

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
    <View style={cardRowStyles.container}>
      <View
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
          cardStyles.leftColumnAlignTop,
        ]}
      >
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
        <Link
          href={fixURL(url, { addBottomAnchor })}
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            numberOfLines={numberOfLines}
            style={[
              getCardStylesForTheme(springAnimatedTheme).commentText,
              isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            {body}
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
})
