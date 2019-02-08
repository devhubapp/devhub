import React from 'react'
import { View } from 'react-native'

import {
  getCommentIdFromUrl,
  getGitHubSearchURL,
  getGitHubURLForUser,
  trimNewLinesAndSpaces,
  tryGetUsernameFromGitHubEmail,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIcon } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { cardRowStyles } from './styles'

export interface CommitRowProps {
  authorEmail: string
  authorName: string
  authorUsername?: string
  isRead: boolean
  latestCommentUrl?: string
  message: string
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
  url: string
}

export interface CommitRowState {}

export const CommitRow = React.memo((props: CommitRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    authorEmail,
    authorName,
    authorUsername: _authorUsername,
    isRead,
    latestCommentUrl,
    message: _message,
    showMoreItemsIndicator,
    smallLeftColumn,
    url,
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
    <View style={cardRowStyles.container}>
      <View
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      >
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
              : getGitHubSearchURL({ q: authorEmail || '', type: 'Users' })
          }
        />
      </View>

      <View style={cardStyles.rightColumn}>
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
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            numberOfLines={1}
            style={[
              getCardStylesForTheme(springAnimatedTheme).normalText,
              isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            <SpringAnimatedIcon
              name="git-commit"
              size={13}
              style={[
                getCardStylesForTheme(springAnimatedTheme).normalText,
                getCardStylesForTheme(springAnimatedTheme).icon,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            />{' '}
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
    </View>
  )
})
