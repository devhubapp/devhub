import React, { SFC } from 'react'
import { Text, View } from 'react-native'

import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { getUserURL } from './helpers'
import { getCardRowStylesForTheme } from './styles'

export interface UserRowProps {
  avatarURL: string
  isRead: boolean
  showMoreItemsIndicator?: boolean
  userLinkURL: string
  username: string
}

export interface UserRowState {}

const UserRow: SFC<UserRowProps> = ({
  avatarURL,
  isRead,
  showMoreItemsIndicator,
  userLinkURL,
  username,
}) => (
  <ThemeConsumer>
    {({ theme }) => (
      <View style={getCardRowStylesForTheme(theme).container}>
        <View style={getCardStylesForTheme(theme).leftColumn}>
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
            <Text
              style={[
                getCardRowStylesForTheme(theme).usernameText,
                (isRead || showMoreItemsIndicator) &&
                  getCardStylesForTheme(theme).mutedText,
              ]}
            >
              {showMoreItemsIndicator ? '...' : username}
            </Text>
          </Link>
        </View>
      </View>
    )}
  </ThemeConsumer>
)

export default UserRow
