import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, GitHubIcon } from '@devhub/core'
import { useAnimatedTheme } from '../../../hooks/use-animated-theme'
import { useReduxAction } from '../../../hooks/use-redux-action'
import * as actions from '../../../redux/actions'
import * as colors from '../../../styles/colors'
import { AnimatedIcon } from '../../animated/AnimatedIcon'
import { AnimatedText } from '../../animated/AnimatedText'
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
  ids: Array<string | number>
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

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  const {
    actionText,
    avatarURL,
    cardIconColor,
    cardIconName,
    createdAt,
    ids,
    isBot,
    isPrivate,
    isSaved,
    smallLeftColumn,
    userLinkURL,
    username: _username,
  } = props

  const username = isBot ? _username!.replace('[bot]', '') : _username

  return (
    <View
      key={`event-card-header-${ids.join(',')}-inner`}
      style={styles.container}
    >
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
                <AnimatedText
                  numberOfLines={1}
                  style={getCardStylesForTheme(theme).usernameText}
                >
                  {username}
                </AnimatedText>
              </Link>
              {!!isBot && (
                <>
                  <Text children=" " />
                  <AnimatedText
                    numberOfLines={1}
                    style={getCardStylesForTheme(theme).timestampText}
                  >{`• BOT`}</AnimatedText>
                </>
              )}
              <IntervalRefresh date={createdAt}>
                {() => {
                  const dateText = getDateSmallText(createdAt)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children=" " />
                      <AnimatedText
                        numberOfLines={1}
                        style={getCardStylesForTheme(theme).timestampText}
                      >
                        {`• ${dateText}`}
                      </AnimatedText>
                    </>
                  )
                }}
              </IntervalRefresh>
            </View>

            <AnimatedText
              numberOfLines={1}
              style={getCardStylesForTheme(theme).descriptionText}
            >
              {!!isPrivate && (
                <AnimatedText style={getCardStylesForTheme(theme).mutedText}>
                  <AnimatedIcon
                    name="lock"
                    style={getCardStylesForTheme(theme).mutedText}
                  />{' '}
                </AnimatedText>
              )}
              {actionText}
            </AnimatedText>
          </View>

          <CardIcon
            name="bookmark"
            color={
              isSaved
                ? colors.brandBackgroundColor
                : theme.foregroundColorMuted50
            }
            onPress={() => saveItemsForLater({ itemIds: ids, save: !isSaved })}
          />
          <CardIcon name={cardIconName} color={cardIconColor} />
        </View>
      </View>
    </View>
  )
}
