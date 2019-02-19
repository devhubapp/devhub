import React from 'react'
import { View } from 'react-native'

import { stripMarkdown, trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { parseTextWithEmojisToReactComponents } from '../../../../utils/helpers/github/emojis'
import { fixURL } from '../../../../utils/helpers/github/url'
import {
  SpringAnimatedText,
  SpringAnimatedTextProps,
} from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link, LinkProps } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { cardRowStyles } from './styles'

export interface CommentRowProps {
  addBottomAnchor?: boolean
  analyticsLabel?: LinkProps['analyticsLabel']
  avatarURL: string | undefined
  body: string
  isRead: boolean
  numberOfLines?: number
  smallLeftColumn?: boolean
  textStyle?: SpringAnimatedTextProps['style']
  url?: string
  userLinkURL: string | undefined
  username: string | undefined
}

export const CommentRow = React.memo((props: CommentRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    addBottomAnchor,
    analyticsLabel,
    avatarURL,
    body: _body,
    isRead,
    numberOfLines = 3,
    smallLeftColumn,
    textStyle,
    url,
    userLinkURL,
    username,
  } = props

  const body = trimNewLinesAndSpaces(
    stripMarkdown(`${_body || ''}`),
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
          small
          style={cardStyles.avatar}
          username={username}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          analyticsLabel={analyticsLabel}
          href={fixURL(url, { addBottomAnchor })}
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            numberOfLines={numberOfLines}
            style={[
              getCardStylesForTheme(springAnimatedTheme).commentText,
              textStyle,
              isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            {parseTextWithEmojisToReactComponents(body, {
              imageProps: {
                style: {
                  width: 14,
                  height: 14,
                },
              },
            })}
          </SpringAnimatedText>
        </Link>
      </View>
    </View>
  )
})
