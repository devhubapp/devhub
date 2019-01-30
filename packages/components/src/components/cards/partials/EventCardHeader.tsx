import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { getDateSmallText, GitHubIcon } from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../../hooks/use-redux-action'
import { Platform } from '../../../libs/platform'
import * as actions from '../../../redux/actions'
import * as colors from '../../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../../styles/variables'
import { SpringAnimatedIcon } from '../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../../animated/spring/SpringAnimatedView'
import { ColumnHeaderItem } from '../../columns/ColumnHeaderItem'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { cardStyles, getCardStylesForTheme } from '../styles'
import { getUserURL } from './rows/helpers'

export interface EventCardHeaderProps {
  actionText: string
  avatarURL: string
  cardIconColor?: string
  cardIconName: GitHubIcon
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate?: boolean
  isSaved?: boolean
  smallLeftColumn?: boolean
  userLinkURL: string
  username: string
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },

  rightColumnCentered: {
    flex: 1,
    justifyContent: 'center',
  },

  outerContainer: {
    flexDirection: 'row',
  },

  innerContainer: {
    flex: 1,
  },
})

export function EventCardHeader(props: EventCardHeaderProps) {
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  const {
    actionText,
    avatarURL,
    cardIconColor,
    cardIconName,
    date,
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
      <SpringAnimatedView
        style={[
          cardStyles.leftColumn,
          smallLeftColumn
            ? cardStyles.leftColumn__small
            : cardStyles.leftColumn__big,
        ]}
      >
        <Avatar
          avatarURL={avatarURL}
          isBot={isBot}
          linkURL={userLinkURL}
          shape={isBot ? undefined : 'circle'}
          style={cardStyles.avatar}
          username={username}
        />
      </SpringAnimatedView>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <SpringAnimatedView style={cardStyles.horizontal}>
              <Link href={getUserURL(username, { isBot })}>
                <SpringAnimatedText
                  numberOfLines={1}
                  style={
                    getCardStylesForTheme(springAnimatedTheme).usernameText
                  }
                >
                  {username}
                </SpringAnimatedText>
              </Link>
              {!!isBot && (
                <>
                  <Text children=" " />
                  <SpringAnimatedText
                    numberOfLines={1}
                    style={
                      getCardStylesForTheme(springAnimatedTheme).timestampText
                    }
                  >
                    <Text children="•" style={{ fontSize: 9 }} />
                    <Text children=" " />
                    BOT
                  </SpringAnimatedText>
                </>
              )}
              <IntervalRefresh date={date}>
                {() => {
                  const dateText = getDateSmallText(date, false)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children=" " />
                      <SpringAnimatedText
                        numberOfLines={1}
                        style={
                          getCardStylesForTheme(springAnimatedTheme)
                            .timestampText
                        }
                        {...Platform.select({
                          web: { title: getDateSmallText(date, true) },
                        })}
                      >
                        <Text children="•" style={{ fontSize: 9 }} />
                        <Text children=" " />
                        {dateText}
                      </SpringAnimatedText>
                    </>
                  )
                }}
              </IntervalRefresh>
            </SpringAnimatedView>

            <SpringAnimatedText
              numberOfLines={1}
              style={getCardStylesForTheme(springAnimatedTheme).descriptionText}
            >
              {!!isPrivate && (
                <SpringAnimatedText
                  style={getCardStylesForTheme(springAnimatedTheme).mutedText}
                >
                  <SpringAnimatedIcon
                    name="lock"
                    style={getCardStylesForTheme(springAnimatedTheme).mutedText}
                  />{' '}
                </SpringAnimatedText>
              )}
              {actionText}
            </SpringAnimatedText>
          </View>

          <ColumnHeaderItem
            analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
            fixedIconSize
            iconName="bookmark"
            iconStyle={{
              width: columnHeaderItemContentSize,
              color: isSaved
                ? colors.brandBackgroundColor
                : springAnimatedTheme.foregroundColorMuted50,
            }}
            onPress={() => saveItemsForLater({ itemIds: ids, save: !isSaved })}
            size={18}
            style={{
              alignSelf: smallLeftColumn ? 'center' : 'flex-start',
              marginTop: 4,
              paddingVertical: 0,
              paddingHorizontal: contentPadding / 3,
            }}
          />

          <ColumnHeaderItem
            fixedIconSize
            iconName={cardIconName}
            iconStyle={[
              {
                width: columnHeaderItemContentSize,
              },
              cardIconName === 'star' && {
                lineHeight: 16,
              },
              !!cardIconColor && { color: cardIconColor },
            ]}
            size={18}
            style={{
              alignSelf: smallLeftColumn ? 'center' : 'flex-start',
              marginTop: 4,
              paddingVertical: 0,
              paddingHorizontal: contentPadding / 3,
              marginRight: -contentPadding / 2,
            }}
          />
        </View>
      </View>
    </View>
  )
}
