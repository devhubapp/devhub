import React from 'react'
import { View } from 'react-native'

import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { AnimatedText } from '../../../animated/AnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { getUserURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

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
  const theme = useAnimatedTheme()

  const {
    avatarURL,
    isRead,
    showMoreItemsIndicator,
    smallLeftColumn,
    userLinkURL,
    username,
  } = props

  return (
    <View style={getCardRowStylesForTheme(theme).container}>
      <View
        style={[
          getCardStylesForTheme(theme).leftColumn,
          smallLeftColumn
            ? getCardStylesForTheme(theme).leftColumn__small
            : getCardStylesForTheme(theme).leftColumn__big,
        ]}
      >
        <Avatar
          avatarURL={avatarURL}
          isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
          linkURL={userLinkURL}
          small
          style={getCardStylesForTheme(theme).avatar}
          username={username}
        />
      </View>

      <View style={getCardStylesForTheme(theme).rightColumn}>
        <Link
          href={showMoreItemsIndicator ? undefined : getUserURL(username)}
          style={getCardRowStylesForTheme(theme).mainContentContainer}
        >
          <AnimatedText
            style={[
              getCardRowStylesForTheme(theme).usernameText,
              (isRead || showMoreItemsIndicator) &&
                getCardStylesForTheme(theme).mutedText,
            ]}
          >
            {showMoreItemsIndicator ? '...' : username}
          </AnimatedText>
        </Link>
      </View>
    </View>
  )
})
