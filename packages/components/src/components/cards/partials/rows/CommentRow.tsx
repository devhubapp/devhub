import React from 'react'
import { View } from 'react-native'

import { Omit, stripMarkdown, trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { smallAvatarSize } from '../../../../styles/variables'
import { parseTextWithEmojisToReactComponents } from '../../../../utils/helpers/github/emojis'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import {
  SpringAnimatedText,
  SpringAnimatedTextProps,
} from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link, LinkProps } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface CommentRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  addBottomAnchor?: boolean
  analyticsLabel?: LinkProps['analyticsLabel']
  avatarUrl: string | undefined
  body: string
  isRead: boolean
  leftContent: 'avatar' | 'icon' | 'none'
  numberOfLines?: number
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
    avatarUrl,
    body: _body,
    leftContent,
    isRead,
    numberOfLines = props.numberOfLines ||
      (props.viewMode === 'compact' ? 1 : 2),
    textStyle,
    url,
    userLinkURL,
    username,
    viewMode,
    ...otherProps
  } = props

  const body = trimNewLinesAndSpaces(stripMarkdown(`${_body || ''}`), 100)
  if (!body) return null

  const isBot = Boolean(username && username.indexOf('[bot]') >= 0)

  return (
    <BaseRow
      {...otherProps}
      left={
        leftContent === 'icon' ? (
          <SpringAnimatedIcon
            name="comment"
            size={smallAvatarSize}
            style={[
              { alignSelf: 'flex-end' },
              getCardStylesForTheme(springAnimatedTheme).normalText,
              getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          />
        ) : leftContent === 'avatar' ? (
          <Avatar
            avatarUrl={avatarUrl}
            isBot={isBot}
            linkURL={userLinkURL}
            small
            style={cardStyles.avatar}
            username={username}
          />
        ) : null
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            analyticsLabel={analyticsLabel}
            href={fixURL(url, { addBottomAnchor })}
          >
            <SpringAnimatedText
              numberOfLines={numberOfLines}
              style={[
                getCardStylesForTheme(springAnimatedTheme).commentText,
                textStyle,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
              {...!!_body &&
                Platform.select({
                  web: {
                    title: _body,
                  },
                })}
            >
              {parseTextWithEmojisToReactComponents(body, {
                key: `comment-${url}`,
                imageProps: {
                  style: {
                    marginHorizontal: 2,
                    width: 12,
                    height: 12,
                  },
                },
              })}
            </SpringAnimatedText>
          </Link>
        </View>
      }
      viewMode={viewMode}
    />
  )
})
