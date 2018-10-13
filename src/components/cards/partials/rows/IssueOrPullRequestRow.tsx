import React, { SFC } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import defaultStyles from '../../../../styles/styles'
import { contentPadding } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { ThemeConsumer } from '../../../context/ThemeContext'
import { getCardStylesForTheme } from '../../styles'
import { CardItemId } from '../CardItemId'
import { getCardRowStylesForTheme } from './styles'

export interface IProps {
  avatarURL: string
  iconColor?: string
  iconName: string
  isRead: boolean
  issueNumber: number
  title: string
  url: string
  username: string
  userLinkURL: string
}

export interface IState {}

const styles = StyleSheet.create({
  cardItemId: {
    marginLeft: contentPadding,
  } as ViewStyle,
})

const IssueOrPullRequestRow: SFC<IProps> = ({
  avatarURL,
  iconColor,
  iconName,
  isRead,
  issueNumber,
  title: _title,
  url,
  username,
  userLinkURL,
}) => {
  const title = trimNewLinesAndSpaces(_title)
  if (!title) return null

  const byText = username ? `@${username}` : ''

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <View style={getCardRowStylesForTheme(theme).container}>
          <View style={getCardStylesForTheme(theme).leftColumn}>
            {Boolean(username) && (
              <Avatar
                avatarURL={avatarURL}
                isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
                linkURL={userLinkURL}
                small
                style={getCardStylesForTheme(theme).avatar}
                username={username}
              />
            )}
          </View>

          <View style={getCardStylesForTheme(theme).rightColumn}>
            <Link
              href={fixURL(url, {
                issueOrPullRequestNumber: issueNumber,
              })}
              style={getCardRowStylesForTheme(theme).mainContentContainer}
            >
              <Text
                numberOfLines={1}
                style={[
                  defaultStyles.full,
                  getCardStylesForTheme(theme).normalText,
                  isRead && getCardStylesForTheme(theme).mutedText,
                ]}
              >
                <Icon color={iconColor} name={iconName} /> {title}
                {Boolean(byText) && (
                  <Text
                    style={[
                      getCardStylesForTheme(theme).normalText,
                      getCardStylesForTheme(theme).smallText,
                      getCardStylesForTheme(theme).mutedText,
                    ]}
                  >
                    {' '}
                    by {byText}
                  </Text>
                )}
              </Text>
            </Link>

            <CardItemId
              id={issueNumber}
              isRead={isRead}
              style={styles.cardItemId}
              url={url}
            />
          </View>
        </View>
      )}
    </ThemeConsumer>
  )
}

export default IssueOrPullRequestRow
