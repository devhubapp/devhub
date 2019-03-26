import React from 'react'

import { getGitHubURLForUser, Omit } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles, getCardRowStylesForTheme } from './styles'

export interface UserRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  avatarUrl: string
  isRead: boolean
  showMoreItemsIndicator?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

export const UserRow = React.memo((props: UserRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    avatarUrl,
    isRead,
    showMoreItemsIndicator,
    userLinkURL,
    username,
    ...otherProps
  } = props

  return (
    <BaseRow
      {...otherProps}
      left={
        <Avatar
          avatarUrl={avatarUrl}
          isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
          linkURL={userLinkURL}
          small
          style={cardStyles.avatar}
          username={username}
        />
      }
      right={
        <Link
          href={
            showMoreItemsIndicator ? undefined : getGitHubURLForUser(username)
          }
          style={cardRowStyles.mainContentContainer}
        >
          <SpringAnimatedText
            style={[
              getCardRowStylesForTheme(springAnimatedTheme).usernameText,
              (isRead || showMoreItemsIndicator) &&
                getCardStylesForTheme(springAnimatedTheme).mutedText,
            ]}
          >
            {showMoreItemsIndicator ? '...' : username}
          </SpringAnimatedText>
        </Link>
      }
    />
  )
})
