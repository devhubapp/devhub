import React, { SFC } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { Octicons as Icon } from '../../../../libs/vector-icons'
import defaultStyles from '../../../../styles/styles'
import { contentPadding } from '../../../../styles/variables'
import { ITheme } from '../../../../types'
import { trimNewLinesAndSpaces } from '../../../../utils/helpers/shared'
import Avatar from '../../../common/Avatar'
import cardStyles from '../../styles'
import { CardItemId } from '../CardItemId'
import { getGithubURLPressHandler } from './helpers'
import rowStyles from './styles'

export interface IProps {
  avatarURL: string
  iconColor?: string
  iconName: string
  isRead: boolean
  issueNumber: number
  theme: ITheme
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
  theme,
  title: _title,
  url,
  username,
  userLinkURL,
}) => {
  const title = trimNewLinesAndSpaces(_title)
  if (!title) return null

  const byText = username ? `@${username}` : ''

  return (
    <View style={rowStyles.container}>
      <View style={cardStyles.leftColumn}>
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
        <TouchableOpacity
          onPress={getGithubURLPressHandler(url, {
            issueOrPullRequestNumber: issueNumber,
          })}
          style={rowStyles.mainContentContainer}
        >
          <Text
            numberOfLines={1}
            style={[
              defaultStyles.full,
              cardStyles.normalText,
              isRead && cardStyles.mutedText,
            ]}
          >
            <Icon color={iconColor} name={iconName} /> {title}
            {Boolean(byText) && (
              <Text
                style={[
                  cardStyles.normalText,
                  cardStyles.smallText,
                  cardStyles.mutedText,
                ]}
              >
                {' '}
                by {byText}
              </Text>
            )}
          </Text>
        </TouchableOpacity>

        <CardItemId
          id={issueNumber}
          isRead={isRead}
          style={styles.cardItemId}
          theme={theme}
          url={url}
        />
      </View>
    </View>
  )
}

export default IssueOrPullRequestRow
