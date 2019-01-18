import React from 'react'
import { View } from 'react-native'

import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { getUserURL } from './helpers'
import { cardRowStyles, getCardRowStylesForTheme } from './styles'

export interface UserRowProps {
  avatarURL: string
  isRead: boolean
  showMoreItemsIndicator?: boolean
  smallLeftColumn?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

export const UserRow = React.memo((props: UserRowProps) => {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const {
    avatarURL,
    isRead,
    showMoreItemsIndicator,
    smallLeftColumn,
    userLinkURL,
    username,
  } = props

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
          avatarURL={avatarURL}
          isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
          linkURL={userLinkURL}
          small
          style={cardStyles.avatar}
          username={username}
        />
      </View>

      <View style={cardStyles.rightColumn}>
        <Link
          href={showMoreItemsIndicator ? undefined : getUserURL(username)}
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
      </View>
    </View>
  )
})
