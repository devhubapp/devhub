import React from 'react'
import { View } from 'react-native'

import { stripMarkdown, trimNewLinesAndSpaces } from '@devhub/core'
import { smallAvatarSize } from '../../../../styles/variables'
import { parseTextWithEmojisToReactComponents } from '../../../../utils/helpers/github/emojis'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link, LinkProps } from '../../../common/Link'
import { ThemedIcon } from '../../../themed/ThemedIcon'
import { ThemedTextProps } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
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
  leftContent: 'avatar' | 'icon' | 'none'
  maxLength?: number | null | undefined
  muted: boolean
  numberOfLines?: number
  textStyle?: ThemedTextProps['style']
  url?: string
  userLinkURL: string | undefined
  username: string | undefined
}

export const CommentRow = React.memo((props: CommentRowProps) => {
  const {
    addBottomAnchor,
    analyticsLabel,
    avatarUrl,
    body: _body,
    leftContent,
    maxLength = props.viewMode === 'compact' ? 60 : 120,
    muted,
    numberOfLines = props.numberOfLines ||
      (props.viewMode === 'compact' ? 1 : 2),
    textStyle,
    url,
    userLinkURL,
    username,
    viewMode,
    ...otherProps
  } = props

  const body = trimNewLinesAndSpaces(
    stripMarkdown(`${_body || ''}`),
    maxLength || undefined,
  )
  if (!body) return null

  const isBot = Boolean(username && username.indexOf('[bot]') >= 0)

  return (
    <BaseRow
      {...otherProps}
      left={
        leftContent === 'icon' ? (
          <ThemedIcon
            color="foregroundColorMuted60"
            name="comment"
            size={smallAvatarSize}
            style={[{ alignSelf: 'flex-end' }, cardStyles.normalText]}
          />
        ) : leftContent === 'avatar' ? (
          <Avatar
            avatarUrl={avatarUrl}
            isBot={isBot}
            linkURL={userLinkURL}
            muted={muted}
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
            enableTextWrapper
            href={fixURL(url, { addBottomAnchor })}
            textProps={{
              color: muted ? 'foregroundColorMuted60' : 'foregroundColor',
              numberOfLines,
              style: [cardStyles.commentText, textStyle],
            }}
            tooltip={_body}
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
          </Link>
        </View>
      }
      viewMode={viewMode}
    />
  )
})

CommentRow.displayName = 'CommentRow'
