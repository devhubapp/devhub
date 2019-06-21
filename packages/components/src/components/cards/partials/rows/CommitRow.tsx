import React from 'react'
import { View } from 'react-native'

import {
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
  trimNewLinesAndSpaces,
  tryGetUsernameFromGitHubEmail,
} from '@devhub/core'
import { sharedStyles } from '../../../../styles/shared'
import { smallAvatarSize } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemedIcon } from '../../../themed/ThemedIcon'
import { ThemedText } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface CommitRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  authorEmail: string
  authorName: string
  authorUsername?: string
  bold?: boolean
  hideIcon?: boolean
  isCommitMainSubject: boolean
  isPrivate: boolean
  latestCommentUrl?: string
  message: string
  muted: boolean
  url: string
}

export interface CommitRowState {}

export const CommitRow = React.memo((props: CommitRowProps) => {
  const {
    authorEmail,
    authorName,
    authorUsername: _authorUsername,
    bold,
    hideIcon,
    isCommitMainSubject,
    isPrivate,
    latestCommentUrl,
    message: _message,
    muted,
    url,
    ...otherProps
  } = props

  const message = trimNewLinesAndSpaces((_message || '').split('\n')[0], 100)
  if (!message) return null

  const authorUsername =
    _authorUsername || tryGetUsernameFromGitHubEmail(authorEmail)

  let byText = authorName
  if (authorUsername) byText += ` @${authorUsername}`
  else if (authorEmail)
    byText += byText ? ` <${authorEmail}>` : ` ${authorEmail}`
  byText = trimNewLinesAndSpaces(byText)

  return (
    <BaseRow
      {...otherProps}
      left={
        authorEmail || authorUsername ? (
          <Avatar
            email={authorEmail}
            isBot={Boolean(
              authorUsername && authorUsername.indexOf('[bot]') >= 0,
            )}
            muted={muted}
            small
            style={cardStyles.avatar}
            username={authorUsername}
            linkURL={
              authorUsername
                ? getGitHubURLForUser(authorUsername)
                : getGitHubSearchURL({
                    q: authorEmail || '',
                    type: 'Users',
                  })
            }
          />
        ) : isPrivate ? (
          <ThemedIcon color="orange" name="lock" size={smallAvatarSize} />
        ) : null
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            enableTextWrapper
            href={fixURL(url, {
              commentId:
                (latestCommentUrl && getCommentIdFromUrl(latestCommentUrl)) ||
                undefined,
            })}
            style={sharedStyles.flex}
            textProps={{
              color: muted ? 'foregroundColorMuted60' : 'foregroundColor',
              numberOfLines: 1,
              style: [
                cardStyles.normalText,
                !isCommitMainSubject && cardStyles.smallText,
                bold && cardStyles.boldText,
              ],
            }}
            tooltip={`${_message}${byText ? `\n\n${byText}` : ''}`}
          >
            <>
              {' '}
              {!hideIcon && (
                <>
                  <ThemedIcon
                    name="git-commit"
                    size={13}
                    style={[cardStyles.normalText, cardStyles.icon]}
                  />{' '}
                </>
              )}
              {message}
              {Boolean(byText) && (
                <ThemedText
                  color="foregroundColorMuted60"
                  style={[cardStyles.normalText, cardStyles.smallText]}
                >
                  {` by ${byText}`}
                </ThemedText>
              )}
            </>
          </Link>
        </View>
      }
    />
  )
})
