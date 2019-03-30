import React from 'react'
import { View } from 'react-native'

import {
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
  Omit,
  trimNewLinesAndSpaces,
  tryGetUsernameFromGitHubEmail,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import * as colors from '../../../../styles/colors'
import { smallAvatarSize } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
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
  isPrivate: boolean
  isRead: boolean
  latestCommentUrl?: string
  message: string
  showMoreItemsIndicator?: boolean
  url: string
}

export interface CommitRowState {}

export const CommitRow = React.memo((props: CommitRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    authorEmail,
    authorName,
    authorUsername: _authorUsername,
    bold,
    hideIcon,
    isPrivate,
    isRead,
    latestCommentUrl,
    message: _message,
    showMoreItemsIndicator,
    url,
    ...otherProps
  } = props

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
    <BaseRow
      {...otherProps}
      left={
        authorEmail || authorUsername ? (
          <Avatar
            email={authorEmail}
            isBot={Boolean(
              authorUsername && authorUsername.indexOf('[bot]') >= 0,
            )}
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
          <SpringAnimatedIcon
            name="lock"
            size={smallAvatarSize}
            style={{ color: colors.orange }}
          />
        ) : null
      }
      right={
        <View style={cardRowStyles.mainContentContainer}>
          <Link
            href={
              showMoreItemsIndicator
                ? undefined
                : fixURL(url, {
                    commentId:
                      (latestCommentUrl &&
                        getCommentIdFromUrl(latestCommentUrl)) ||
                      undefined,
                  })
            }
            style={cardStyles.flex}
          >
            <SpringAnimatedText
              numberOfLines={1}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                bold && cardStyles.boldText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              {!hideIcon && (
                <>
                  <SpringAnimatedIcon
                    name="git-commit"
                    size={13}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).normalText,
                      getCardStylesForTheme(springAnimatedTheme).icon,
                      isRead &&
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                    ]}
                  />{' '}
                </>
              )}
              {showMoreItemsIndicator ? '' : message}
              {Boolean(byText) && (
                <SpringAnimatedText
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).normalText,
                    cardStyles.smallText,
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                  ]}
                >
                  {showMoreItemsIndicator ? '...' : ` by ${byText}`}
                </SpringAnimatedText>
              )}
            </SpringAnimatedText>
          </Link>
        </View>
      }
    />
  )
})
