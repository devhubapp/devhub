import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
} from '@devhub/core'
import { Platform } from '../../../libs/platform'
import { sharedStyles } from '../../../styles/shared'
import { Avatar } from '../../common/Avatar'
import { BookmarkButton } from '../../common/BookmarkButton'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { ToggleReadButton } from '../../common/ToggleReadButton'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedView } from '../../themed/ThemedView'
import { cardStyles } from '../styles'

export interface EventCardHeaderProps {
  actionText: string
  avatarUrl: string
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate?: boolean
  isRead: boolean
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
  const {
    actionText,
    avatarUrl,
    date,
    ids,
    isBot,
    isPrivate,
    isRead,
    isSaved,
    smallLeftColumn,
    userLinkURL: _userLinkURL,
    username: _username,
  } = props

  const username = isBot ? _username!.replace('[bot]', '') : _username
  const userLinkURL = _userLinkURL || getGitHubURLForUser(username, { isBot })

  return (
    <View
      key={`event-card-header-${ids.join(',')}-inner`}
      style={styles.container}
    >
      <ThemedView
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
      </ThemedView>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <View style={sharedStyles.horizontalAndVerticallyAligned}>
              <Link
                href={userLinkURL}
                textProps={{
                  color: isRead ? 'foregroundColorMuted50' : 'foregroundColor',
                  numberOfLines: 1,
                  style: [cardStyles.usernameText, { lineHeight: undefined }],
                }}
              >
                {username}
              </Link>

              {!!isBot && (
                <>
                  <Text children="  " />
                  <ThemedText
                    color="foregroundColorMuted50"
                    numberOfLines={1}
                    style={[
                      cardStyles.timestampText,
                      { lineHeight: undefined },
                    ]}
                  >
                    BOT
                  </ThemedText>
                </>
              )}

              <IntervalRefresh date={date}>
                {() => {
                  const dateText = getDateSmallText(date, false)
                  if (!dateText) return null

                  return (
                    <>
                      <Text children="  " />
                      <ThemedText
                        color="foregroundColorMuted50"
                        numberOfLines={1}
                        style={[
                          cardStyles.timestampText,
                          { lineHeight: undefined },
                        ]}
                        {...Platform.select({
                          web: { title: getFullDateText(date) },
                        })}
                      >
                        {!!isPrivate && (
                          <>
                            <ThemedIcon name="lock" />{' '}
                          </>
                        )}
                        {dateText}
                      </ThemedText>
                    </>
                  )
                }}
              </IntervalRefresh>
            </View>

            <Spacer height={2} />

            <ThemedText
              color={isRead ? 'foregroundColorMuted50' : 'foregroundColor'}
              numberOfLines={1}
              style={cardStyles.headerActionText}
            >
              {actionText.toLowerCase()}
            </ThemedText>
          </View>

          <ToggleReadButton
            isRead={isRead}
            itemIds={ids}
            style={{
              alignSelf: 'flex-start',
            }}
            type="activity"
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
