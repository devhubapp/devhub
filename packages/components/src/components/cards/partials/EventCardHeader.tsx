import { MomentInput } from 'moment'
import React from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../../hooks/use-animated-theme'
import * as actions from '../../../redux/actions'
import { useReduxAction } from '../../../redux/hooks/use-redux-action'
import * as colors from '../../../styles/colors'
import { AnimatedIcon } from '../../animated/AnimatedIcon'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { getCardStylesForTheme } from '../styles'
import { CardIcon } from './CardIcon'
import { getUserURL } from './rows/helpers'

export interface EventCardHeaderProps {
  actionText: string
  avatarURL: string
  cardIconColor?: string
  cardIconName: GitHubIcon
  createdAt: MomentInput
  id: string | number
  isBot: boolean
  isPrivate?: boolean
  isSaved?: boolean
  smallLeftColumn?: boolean
  userLinkURL: string
  username: string
}

export interface EventCardHeaderState {}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexGrow: 1,
  },

  rightColumnCentered: {
    flex: 1,
    justifyContent: 'center',
  },

  outerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  innerContainer: {
    flex: 1,
  },
})

export function EventCardHeader(props: EventCardHeaderProps) {
  const theme = useAnimatedTheme()

  const saveItemForLater = useReduxAction(actions.saveItemForLater)

  const {
    actionText,
    avatarURL,
    cardIconColor,
    cardIconName,
    createdAt,
    id,
    isBot,
    isPrivate,
    isSaved,
    smallLeftColumn,
    userLinkURL,
    username: _username,
  } = props

  const username = isBot ? _username!.replace('[bot]', '') : _username

  return (
    <View key={`event-card-header-${id}-inner`} style={styles.container}>
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
                <Animated.Text
                  numberOfLines={1}
                  style={getCardStylesForTheme(theme).usernameText}
                >
                  {username}
                </Animated.Text>
              </Link>
              {!!isBot && (
                <>
                  <Text children=" " />
                  <Animated.Text
                    numberOfLines={1}
                    style={getCardStylesForTheme(theme).timestampText}
                  >{`• BOT`}</Animated.Text>
                </>
              )}
              <IntervalRefresh date={createdAt}>
                {() => {
                  const dateText = getDateSmallText(createdAt)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children=" " />
                      <Animated.Text
                        numberOfLines={1}
                        style={getCardStylesForTheme(theme).timestampText}
                      >
                        {`• ${dateText}`}
                      </Animated.Text>
                    </>
                  )
                }}
              </IntervalRefresh>
            </View>

            <Animated.Text
              numberOfLines={1}
              style={getCardStylesForTheme(theme).descriptionText}
            >
              {!!isPrivate && (
                <Animated.Text style={getCardStylesForTheme(theme).mutedText}>
                  <AnimatedIcon
                    name="lock"
                    style={getCardStylesForTheme(theme).mutedText}
                  />{' '}
                </Animated.Text>
              )}
              {actionText}
            </Animated.Text>
          </View>

          <CardIcon
            name="bookmark"
            color={
              isSaved
                ? colors.brandBackgroundColor
                : theme.foregroundColorMuted50
            }
            onPress={() => saveItemForLater({ itemId: id, save: !isSaved })}
          />
          <CardIcon name={cardIconName} color={cardIconColor} />
        </View>
      </View>
    </View>
  )
}
