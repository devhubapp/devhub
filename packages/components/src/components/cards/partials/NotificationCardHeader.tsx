import { MomentInput } from 'moment'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubIcon,
  GitHubNotificationReason,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../hooks/use-css-variables-or-spring--animated-theme'
import { useReduxAction } from '../../../hooks/use-redux-action'
import { Platform } from '../../../libs/platform'
import * as actions from '../../../redux/actions'
import * as colors from '../../../styles/colors'
import {
  columnHeaderItemContentSize,
  contentPadding,
} from '../../../styles/variables'
import { getNotificationReasonMetadata } from '../../../utils/helpers/github/notifications'
import { SpringAnimatedIcon } from '../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../animated/spring/SpringAnimatedText'
import { SpringAnimatedView } from '../../animated/spring/SpringAnimatedView'
import { ColumnHeaderItem } from '../../columns/ColumnHeaderItem'
import { Avatar } from '../../common/Avatar'
import { IntervalRefresh } from '../../common/IntervalRefresh'
import { Label } from '../../common/Label'
import { Link } from '../../common/Link'
import { Spacer } from '../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../styles'

export interface NotificationCardHeaderProps {
  actionText: string
  avatarUrl: string
  cardIconColor?: string
  cardIconName: GitHubIcon
  date: MomentInput
  ids: Array<string | number>
  isBot: boolean
  isPrivate?: boolean
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
    actionText,
    avatarUrl,
    cardIconColor,
    cardIconName,
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

  const saveItemsForLater = useReduxAction(actions.saveItemsForLater)

  const markItemsAsReadOrUnread = useReduxAction(
    actions.markItemsAsReadOrUnread,
  )

  const reasonDetails = getNotificationReasonMetadata(reason)
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
          style={cardStyles.avatar}
          username={username}
        />
      </SpringAnimatedView>

      <View style={styles.rightColumnCentered}>
        <View style={styles.outerContainer}>
          <View style={styles.innerContainer}>
            <SpringAnimatedView style={cardStyles.horizontal}>
              <Link href={userLinkURL}>
                <SpringAnimatedText
                  numberOfLines={1}
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).usernameText,
                    isRead &&
                      getCardStylesForTheme(springAnimatedTheme).mutedText,
                  ]}
                >
                  {trimNewLinesAndSpaces(username, 18)}
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
                          web: { title: getFullDateText(date) },
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

            {!!actionText && (
              <SpringAnimatedText
                numberOfLines={1}
                style={
                  getCardStylesForTheme(springAnimatedTheme).descriptionText
                }
              >
                {!!isPrivate && (
                  <SpringAnimatedText
                    style={getCardStylesForTheme(springAnimatedTheme).mutedText}
                  >
                    <SpringAnimatedIcon
                      name="lock"
                      style={
                        getCardStylesForTheme(springAnimatedTheme).mutedText
                      }
                    />{' '}
                  </SpringAnimatedText>
                )}
                {actionText}
              </SpringAnimatedText>
            )}

            {!!(reasonDetails && reasonDetails.label) && (
              <>
                <Spacer height={4} />

                <Label
                  color={reasonDetails.color}
                  containerStyle={{ alignSelf: 'flex-start' }}
                  isPrivate={isPrivate}
                  muted={isRead}
                  outline={false}
                  small
                >
                  {reasonDetails.label.toLowerCase()}
                </Label>
              </>
            )}
          </View>

          <ColumnHeaderItem
            analyticsLabel={isRead ? 'mark_as_unread' : 'mark_as_read'}
            enableForegroundHover
            fixedIconSize
            iconName={isRead ? 'mail-read' : 'mail'}
            iconStyle={isRead ? undefined : { lineHeight: 18 }}
            onPress={() =>
              markItemsAsReadOrUnread({
                type: 'notifications',
                itemIds: ids,
                unread: !!isRead,
              })
            }
            size={18}
            style={{
              alignSelf: smallLeftColumn ? 'center' : 'flex-start',
              marginTop: 4,
              paddingVertical: 0,
              paddingHorizontal: contentPadding / 3,
            }}
          />

          <ColumnHeaderItem
            analyticsLabel={isSaved ? 'unsave_for_later' : 'save_for_later'}
            enableForegroundHover
            fixedIconSize
            iconName="bookmark"
            iconStyle={[
              isSaved && {
                color: springAnimatedTheme.primaryBackgroundColor,
              },
            ]}
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
