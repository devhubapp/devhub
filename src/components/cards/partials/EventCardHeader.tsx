import { MomentInput } from 'moment'
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import { IGitHubIcon } from '../../../types'
import { getDateSmallText } from '../../../utils/helpers/shared'
import Avatar from '../../common/Avatar'
import IntervalRefresh from '../../common/IntervalRefresh'
import cardStyles from '../styles'
import CardIcon from './CardIcon'
import { getUserPressHandler } from './rows/helpers'

export interface EventCardHeaderProperties {
  actionText: string
  avatarURL: string
  cardIconColor: string
  cardIconName: IGitHubIcon
  createdAt: MomentInput
  isBot: boolean
  isPrivate?: boolean
  userLinkURL: string
  username: string
}

export interface IState {}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  } as ViewStyle,

  rightColumnCentered: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,

  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  } as ViewStyle,

  innerContainer: {
    flex: 1,
  } as ViewStyle,
})

export default class EventCardHeader extends PureComponent<
  EventCardHeaderProperties
> {
  render() {
    const {
      actionText,
      avatarURL,
      cardIconColor,
      cardIconName,
      createdAt,
      isBot,
      isPrivate,
      userLinkURL,
      username: _username,
    } = this.props

    const username = isBot ? _username!.replace('[bot]', '') : _username

    return (
      <View style={styles.container}>
        <View style={cardStyles.leftColumn}>
          <Avatar
            avatarURL={avatarURL}
            isBot={isBot}
            linkURL={userLinkURL}
            username={username}
            style={cardStyles.avatar}
          />
        </View>

        <View style={styles.rightColumnCentered}>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <View style={cardStyles.horizontal}>
                <TouchableOpacity
                  onPress={getUserPressHandler(username, { isBot })}
                >
                  <Text style={cardStyles.usernameText}>{username}</Text>
                </TouchableOpacity>
                {!!isBot && (
                  <Text style={cardStyles.timestampText}>{` • BOT`}</Text>
                )}
                <IntervalRefresh date={createdAt}>
                  {() => {
                    const dateText = getDateSmallText(createdAt)
                    if (!dateText) return null

                    return (
                      <Text style={cardStyles.timestampText}>
                        {` • ${dateText}`}
                      </Text>
                    )
                  }}
                </IntervalRefresh>
              </View>

              <Text style={cardStyles.descriptionText}>
                {!!isPrivate && (
                  <Text style={cardStyles.mutedText}>
                    <Icon name="lock" />{' '}
                  </Text>
                )}
                {actionText}
              </Text>
            </View>

            <CardIcon name={cardIconName} color={cardIconColor} />
          </View>
        </View>
      </View>
    )
  }
}
