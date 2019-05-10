import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubNotificationReason,
  ThemeColors,
} from '@devhub/core'
import { Platform } from '../../../libs/platform'
import { sharedStyles } from '../../../styles/shared'
import { contentPadding } from '../../../styles/variables'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { cardStyles } from '../styles'
import { NotificationReason } from './rows/partials/NotificationReason'

export interface NotificationCardHeaderProps {
  avatarUrl: string | undefined
  backgroundThemeColor: keyof ThemeColors | ((theme: ThemeColors) => string)
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate: boolean
  isRead: boolean
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
    reason,
    smallLeftColumn,
    userLinkURL: _userLinkURL,
    username: _username,
  } = props

  const username = isBot ? _username!.replace('[bot]', '') : _username
  const userLinkURL = _userLinkURL || getGitHubURLForUser(username, { isBot })

  return (
    <View
      key={`notification-card-header-${ids.join(',')}-inner`}
      style={styles.container}
    >
      <View
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
      </View>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View
              style={[
                sharedStyles.flex,
                sharedStyles.horizontalAndVerticallyAligned,
                { maxWidth: '100%', overflow: 'hidden' },
              ]}
            >
              <View
                style={[
                  sharedStyles.flex,
                  sharedStyles.horizontalAndVerticallyAligned,
                  { maxWidth: '100%', overflow: 'hidden' },
                ]}
              >
                <Link
                  href={userLinkURL}
                  textProps={{
                    color: isRead
                      ? 'foregroundColorMuted60'
                      : 'foregroundColor',
                    // color: 'foregroundColor',
                    numberOfLines: 1,
                    style: [
                      { maxWidth: '100%' },
                      cardStyles.usernameText,
                      // isRead && { fontWeight: undefined },
                      { lineHeight: undefined },
                    ],
                  }}
                >
                  {username}
                </Link>

                {!!isBot && (
                  <>
                    <Text children="  " />
                    <ThemedText
                      color="foregroundColorMuted60"
                      numberOfLines={1}
                      style={[
                        cardStyles.timestampText,
                        { lineHeight: undefined },
                      ]}
                    >
                      <Text children="  " />
                      BOT
                    </ThemedText>
                  </>
                )}
              </View>

              <Spacer width={contentPadding / 2} />

              <NotificationReason
                backgroundThemeColor={backgroundThemeColor}
                muted={isRead}
                reason={reason}
              />
            </View>
          </View>

          <View
            style={[
              sharedStyles.horizontalAndVerticallyAligned,
              { alignSelf: 'flex-start' },
            ]}
          >
            {/* {!isRead && (
              <>
                <Spacer width={contentPadding / 2} />
                <ThemedView
                  backgroundColor={isRead ? undefined : 'foregroundColor'}
                  style={{ width: 6, height: 6, borderRadius: 6 / 2 }}
                />
              </>
            )} */}

            <IntervalRefresh date={date}>
              {() => {
                const dateText = getDateSmallText(date, false)
                if (!dateText) return null

                return (
                  <>
                    <Text children="  " />
                    <ThemedText
                      color="foregroundColorMuted60"
                      numberOfLines={1}
                      style={cardStyles.timestampText}
                      {...Platform.select({
                        web: { title: getFullDateText(date) },
                      })}
                    >
                      {!!isPrivate && (
                        <>
                          <ThemedIcon
                            name="lock"
                            style={cardStyles.smallerText}
                          />{' '}
                        </>
                      )}

                      {dateText}
                    </ThemedText>
                  </>
                )
              }}
            </IntervalRefresh>

            <Spacer width={contentPadding / 3} />
          </View>
        </View>
      </View>
    </View>
  )
}
