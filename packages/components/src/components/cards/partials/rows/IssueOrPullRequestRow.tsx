import React from 'react'
import { StyleSheet, View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { contentPadding } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import {
  SpringAnimatedIcon,
  SpringAnimatedIconProps,
} from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { CardItemId } from '../CardItemId'
import { cardRowStyles } from './styles'

export interface IssueOrPullRequestRowProps {
  addBottomAnchor?: boolean
  avatarURL: string
  iconColor?: string
  iconName: SpringAnimatedIconProps['name']
  isRead: boolean
  issueOrPullRequestNumber: number
  smallLeftColumn?: boolean
  title: string
  url: string
  userLinkURL: string
  username: string
}

export interface IssueOrPullRequestRowState {}

const styles = StyleSheet.create({
  cardItemId: {
    marginLeft: contentPadding,
  },
})

export const IssueOrPullRequestRow = React.memo(
  (props: IssueOrPullRequestRowProps) => {
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const {
      addBottomAnchor,
      avatarURL,
      iconColor,
      iconName,
      isRead,
      issueOrPullRequestNumber,
      smallLeftColumn,
      title: _title,
      url,
      userLinkURL,
      username,
    } = props

    const title = trimNewLinesAndSpaces(_title)
    if (!title) return null

    const byText = username ? `@${username}` : ''

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
          {Boolean(username) && (
            <Avatar
              avatarURL={avatarURL}
              isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
              linkURL={userLinkURL}
              small
              style={cardStyles.avatar}
              username={username}
            />
          )}
        </View>

        <View style={cardStyles.rightColumn}>
          <Link
            href={fixURL(url, {
              addBottomAnchor,
              issueOrPullRequestNumber,
            })}
            style={cardRowStyles.mainContentContainer}
          >
            <SpringAnimatedText
              numberOfLines={1}
              style={[
                Platform.OS !== 'android' && { flexGrow: 1 },
                getCardStylesForTheme(springAnimatedTheme).normalText,
                isRead && getCardStylesForTheme(springAnimatedTheme).mutedText,
              ]}
            >
              <SpringAnimatedIcon
                name={iconName}
                style={{ color: iconColor }}
              />{' '}
              {title}
              {Boolean(byText) && (
                <SpringAnimatedText
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).normalText,
                    cardStyles.smallText,
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                  ]}
                >
                  {' '}
                  by {byText}
                </SpringAnimatedText>
              )}
            </SpringAnimatedText>
          </Link>

          <CardItemId
            id={issueOrPullRequestNumber}
            isRead={isRead}
            style={styles.cardItemId}
            url={url}
          />
        </View>
      </View>
    )
  },
)
