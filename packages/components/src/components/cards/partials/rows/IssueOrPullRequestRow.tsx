import React from 'react'
import { Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { contentPadding } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import {
  SpringAnimatedIcon,
  SpringAnimatedIconProps,
} from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { IntervalRefresh } from '../../../common/IntervalRefresh'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { CardItemId } from '../CardItemId'
import { CardSmallThing } from '../CardSmallThing'
import { cardRowStyles } from './styles'

export interface IssueOrPullRequestRowProps {
  addBottomAnchor?: boolean
  avatarURL: string
  commentsCount?: number
  createdAt: string | undefined
  iconColor?: string
  iconName: SpringAnimatedIconProps['name']
  isRead: boolean
  issueOrPullRequestNumber: number
  smallLeftColumn?: boolean
  title: string
  url: string
  userLinkURL: string
  username: string
}

export const IssueOrPullRequestRow = React.memo(
  (props: IssueOrPullRequestRowProps) => {
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const {
      addBottomAnchor,
      avatarURL,
      commentsCount,
      createdAt,
      iconColor,
      iconName,
      isRead,
      issueOrPullRequestNumber,
      smallLeftColumn,
      title: _title,
      url,
      userLinkURL,
      username,
    } = props

    const title = trimNewLinesAndSpaces(_title)
    if (!title) return null

    const byText = username ? `@${username}` : ''

    return (
      <View style={cardRowStyles.container}>
        <View
          style={[
            cardStyles.leftColumn,
            smallLeftColumn
              ? cardStyles.leftColumn__small
              : cardStyles.leftColumn__big,
          ]}
        >
          {Boolean(username) && (
            <Avatar
              avatarURL={avatarURL}
              isBot={Boolean(username && username.indexOf('[bot]') >= 0)}
              linkURL={userLinkURL}
              small
              style={cardStyles.avatar}
              username={username}
            />
          )}
        </View>

        <View style={cardStyles.rightColumn}>
          <View style={cardRowStyles.mainContentContainer}>
            <Link
              href={fixURL(url, {
                addBottomAnchor,
                issueOrPullRequestNumber,
              })}
            >
              <SpringAnimatedText
                numberOfLines={2}
                style={[
                  Platform.OS !== 'android' && { flexGrow: 1 },
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  isRead &&
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                <SpringAnimatedIcon
                  name={iconName}
                  size={13}
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).normalText,
                    getCardStylesForTheme(springAnimatedTheme).icon,
                    { color: iconColor },
                  ]}
                />{' '}
                {title}
              </SpringAnimatedText>
            </Link>

            <View>
              <Spacer height={4} />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {!!byText && (
                  <Link href={userLinkURL || getGitHubURLForUser(username)}>
                    <SpringAnimatedText
                      style={[
                        getCardStylesForTheme(springAnimatedTheme).normalText,
                        cardStyles.smallText,
                        getCardStylesForTheme(springAnimatedTheme).mutedText,
                      ]}
                    >
                      {byText}
                    </SpringAnimatedText>
                  </Link>
                )}

                {!!createdAt && (
                  <IntervalRefresh date={createdAt}>
                    {() => {
                      const dateText = getDateSmallText(createdAt, false)
                      if (!dateText) return null

                      return (
                        <>
                          {!!byText && <Text children=" " />}

                          <SpringAnimatedText
                            numberOfLines={1}
                            style={
                              getCardStylesForTheme(springAnimatedTheme)
                                .timestampText
                            }
                            {...Platform.select({
                              web: { title: getFullDateText(createdAt) },
                            })}
                          >
                            {!!byText && (
                              <>
                                <Text children="•" style={{ fontSize: 9 }} />
                                <Text children=" " />
                              </>
                            )}

                            {dateText}
                          </SpringAnimatedText>
                        </>
                      )
                    }}
                  </IntervalRefresh>
                )}

                <Spacer flex={1} />

                {typeof commentsCount === 'number' && commentsCount >= 0 && (
                  <>
                    <Spacer width={contentPadding / 2} />

                    <CardSmallThing
                      icon="comment"
                      isRead={isRead}
                      text={commentsCount}
                      url={fixURL(url, {
                        addBottomAnchor,
                        issueOrPullRequestNumber,
                      })}
                    />
                  </>
                )}

                <Spacer width={contentPadding / 2} />

                <CardItemId
                  id={issueOrPullRequestNumber}
                  isRead={isRead}
                  url={fixURL(url, {
                    addBottomAnchor,
                    issueOrPullRequestNumber,
                  })}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  },
)
