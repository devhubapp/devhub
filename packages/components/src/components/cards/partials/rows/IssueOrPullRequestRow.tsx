import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { trimNewLinesAndSpaces } from '@devhub/core/src/utils/helpers/shared'
import { useAnimatedTheme } from '../../../../hooks/use-animated-theme'
import { defaultStyles } from '../../../../styles/styles'
import { contentPadding } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { AnimatedIcon, AnimatedIconProps } from '../../../animated/AnimatedIcon'
import { Avatar } from '../../../common/Avatar'
import { Link } from '../../../common/Link'
import { getCardStylesForTheme } from '../../styles'
import { CardItemId } from '../CardItemId'
import { getCardRowStylesForTheme } from './styles'

export interface IssueOrPullRequestRowProps {
  addBottomAnchor?: boolean
  avatarURL: string
  iconColor?: string
  iconName: AnimatedIconProps['name']
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
    const theme = useAnimatedTheme()

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
      <View style={getCardRowStylesForTheme(theme).container}>
        <View
          style={[
            getCardStylesForTheme(theme).leftColumn,
            smallLeftColumn
              ? getCardStylesForTheme(theme).leftColumn__small
              : getCardStylesForTheme(theme).leftColumn__big,
          ]}
        >
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
              addBottomAnchor,
              issueOrPullRequestNumber,
            })}
            style={getCardRowStylesForTheme(theme).mainContentContainer}
          >
            <Animated.Text
              numberOfLines={1}
              style={[
                defaultStyles.full,
                getCardStylesForTheme(theme).normalText,
                isRead && getCardStylesForTheme(theme).mutedText,
              ]}
            >
              <AnimatedIcon color={iconColor} name={iconName} /> {title}
              {Boolean(byText) && (
                <Animated.Text
                  style={[
                    getCardStylesForTheme(theme).normalText,
                    getCardStylesForTheme(theme).smallText,
                    getCardStylesForTheme(theme).mutedText,
                  ]}
                >
                  {' '}
                  by {byText}
                </Animated.Text>
              )}
            </Animated.Text>
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
