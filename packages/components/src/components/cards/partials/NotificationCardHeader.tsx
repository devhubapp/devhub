import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubNotificationReason,
  ThemeColors,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../libs/platform'
import { sharedStyles } from '../../../styles/shared'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../../animated/spring/SpringAnimatedView'
import { Avatar } from '../../common/Avatar'
import { BookmarkButton } from '../../common/BookmarkButton'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { ToggleReadButton } from '../../common/ToggleReadButton'
import { cardStyles, getCardStylesForTheme } from '../styles'
import { NotificationReason } from './rows/partials/NotificationReason'

export interface NotificationCardHeaderProps {
  avatarUrl: string | undefined
  backgroundThemeColor: keyof ThemeColors
  // cardIconColor?: string
  // cardIconName: GitHubIcon
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate: boolean
  isRead: boolean
  isSaved?: boolean
  reason: GitHubNotificationReason
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

export function NotificationCardHeader(props: NotificationCardHeaderProps) {
  const {
    avatarUrl,
    backgroundThemeColor,
    date,
    ids,
    isBot,
    isPrivate,
    isRead,
    isSaved,
    reason,
    smallLeftColumn,
    userLinkURL: _userLinkURL,
    username: _username,
  } = props

  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const username = isBot ? _username!.replace('[bot]', '') : _username
  const userLinkURL = _userLinkURL || getGitHubURLForUser(username, { isBot })

  return (
    <View
      key={`notification-card-header-${ids.join(',')}-inner`}
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
          avatarUrl={avatarUrl}
          isBot={isBot}
          linkURL={userLinkURL}
          shape={isBot ? undefined : 'circle'}
          small={smallLeftColumn}
          style={cardStyles.avatar}
          username={username}
        />
      </SpringAnimatedView>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <SpringAnimatedView
              style={sharedStyles.horizontalAndVerticallyAligned}
            >
              <Link href={userLinkURL}>
                <SpringAnimatedText
                  numberOfLines={1}
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).usernameText,
                    isRead &&
                      getCardStylesForTheme(springAnimatedTheme).mutedText,
                    { lineHeight: undefined },
                  ]}
                >
                  {trimNewLinesAndSpaces(username, 18)}
                </SpringAnimatedText>
              </Link>
              {!!isBot && (
                <>
                  <Text children="  " />
                  <SpringAnimatedText
                    numberOfLines={1}
                    style={[
                      getCardStylesForTheme(springAnimatedTheme).timestampText,
                      { lineHeight: undefined },
                    ]}
                  >
                    <Text children="  " />
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
                      <Text children="  " />
                      <SpringAnimatedText
                        numberOfLines={1}
                        style={[
                          getCardStylesForTheme(springAnimatedTheme)
                            .timestampText,
                          { lineHeight: undefined },
                        ]}
                        {...Platform.select({
                          web: { title: getFullDateText(date) },
                        })}
                      >
                        <Text children="  " />
                        {dateText}
                      </SpringAnimatedText>
                    </>
                  )
                }}
              </IntervalRefresh>
            </SpringAnimatedView>

            <Spacer height={2} />

            <NotificationReason
              backgroundThemeColor={backgroundThemeColor}
              isPrivate={isPrivate}
              reason={reason}
            />
          </View>

          <ToggleReadButton
            isRead={isRead}
            itemIds={ids}
            style={{
              alignSelf: 'flex-start',
            }}
            type="notifications"
          />

          <BookmarkButton
            isSaved={!!isSaved}
            itemIds={ids}
            style={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
    </View>
  )
}
