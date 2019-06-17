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
import { contentPadding } from '../../../styles/variables'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { ThemedIcon } from '../../themed/ThemedIcon'
import { ThemedText } from '../../themed/ThemedText'
import { ThemedView } from '../../themed/ThemedView'
import { cardStyles } from '../styles'

export interface EventCardHeaderProps {
  actionText: string
  avatarUrl: string
  bold: boolean
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate?: boolean
  muted: boolean
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
    bold,
    date,
    ids,
    isBot,
    isPrivate,
    muted,
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
          muted={muted}
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
                  color: muted ? 'foregroundColorMuted60' : 'foregroundColor',
                  numberOfLines: 1,
                  style: [
                    cardStyles.usernameText,
                    bold && cardStyles.boldText,
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
                    BOT
                  </ThemedText>
                </>
              )}
            </View>

            <Spacer height={2} />

            <ThemedText
              color={muted ? 'foregroundColorMuted60' : 'foregroundColor'}
              numberOfLines={1}
              style={cardStyles.headerActionText}
            >
              {actionText.toLowerCase()}
            </ThemedText>
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
                      color={
                        muted
                          ? 'foregroundColorMuted40'
                          : 'foregroundColorMuted60'
                      }
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
