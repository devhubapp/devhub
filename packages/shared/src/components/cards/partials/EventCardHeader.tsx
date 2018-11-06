import { MomentInput } from 'moment'
import React, { PureComponent } from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'

import { Octicons as Icon } from '../../../libs/vector-icons'
import { GitHubIcon } from '../../../types'
import { getDateSmallText } from '../../../utils/helpers/shared'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { ThemeConsumer } from '../../context/ThemeContext'
import { getCardStylesForTheme } from '../styles'
import { CardIcon } from './CardIcon'
import { getUserURL } from './rows/helpers'

export interface EventCardHeaderProps {
  actionText: string
  avatarURL: string
  cardIconColor: string
  cardIconName: GitHubIcon
  createdAt: MomentInput
  isBot: boolean
  isPrivate?: boolean
  smallLeftColumn?: boolean
  userLinkURL: string
  username: string
}

export interface EventCardHeaderState {}

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

export class EventCardHeader extends PureComponent<EventCardHeaderProps> {
  render() {
    const {
      actionText,
      avatarURL,
      cardIconColor,
      cardIconName,
      createdAt,
      isBot,
      isPrivate,
      smallLeftColumn,
      userLinkURL,
      username: _username,
    } = this.props

    const username = isBot ? _username!.replace('[bot]', '') : _username

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View style={styles.container}>
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
                isBot={isBot}
                linkURL={userLinkURL}
                shape={isBot ? 'rounded' : 'circle'}
                style={getCardStylesForTheme(theme).avatar}
                username={username}
              />
            </View>

            <View style={styles.rightColumnCentered}>
              <View style={styles.outerContainer}>
                <View style={styles.innerContainer}>
                  <View style={getCardStylesForTheme(theme).horizontal}>
                    <Link href={getUserURL(username, { isBot })}>
                      <Text style={getCardStylesForTheme(theme).usernameText}>
                        {username}
                      </Text>
                    </Link>
                    {!!isBot && (
                      <Text
                        style={getCardStylesForTheme(theme).timestampText}
                      >{` • BOT`}</Text>
                    )}
                    <IntervalRefresh date={createdAt}>
                      {() => {
                        const dateText = getDateSmallText(createdAt)
                        if (!dateText) return null

                        return (
                          <Text
                            style={getCardStylesForTheme(theme).timestampText}
                          >
                            {` • ${dateText}`}
                          </Text>
                        )
                      }}
                    </IntervalRefresh>
                  </View>

                  <Text style={getCardStylesForTheme(theme).descriptionText}>
                    {!!isPrivate && (
                      <Text style={getCardStylesForTheme(theme).mutedText}>
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
        )}
      </ThemeConsumer>
    )
  }
}
