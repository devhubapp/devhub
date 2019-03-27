import React from 'react'
import { Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubLabel,
  Omit,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import { contentPadding } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { SpringAnimatedIconProps } from '../../../animated/spring/SpringAnimatedIcon'
import { SpringAnimatedText } from '../../../animated/spring/SpringAnimatedText'
import { Avatar } from '../../../common/Avatar'
import { IntervalRefresh } from '../../../common/IntervalRefresh'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { cardStyles, getCardStylesForTheme } from '../../styles'
import { CardItemId } from '../CardItemId'
import { CardSmallThing } from '../CardSmallThing'
import { LabelsView } from './LabelsView'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles } from './styles'

export interface IssueOrPullRequestRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  addBottomAnchor?: boolean
  avatarUrl: string | undefined
  commentsCount?: number
  createdAt: string | undefined
  iconColor?: string
  iconName: SpringAnimatedIconProps['name']
  id: string | number | undefined
  isRead: boolean
  issueOrPullRequestNumber: number
  labels?: GitHubLabel[] | undefined
  owner: string
  repo: string
  title: string
  url: string
  userLinkURL: string | undefined
  username: string | undefined
}

export const IssueOrPullRequestRow = React.memo(
  (props: IssueOrPullRequestRowProps) => {
    const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

    const {
      addBottomAnchor,
      avatarUrl,
      commentsCount,
      createdAt,
      // iconColor,
      // iconName,
      id,
      isRead,
      issueOrPullRequestNumber,
      labels,
      owner,
      repo,
      title: _title,
      url,
      userLinkURL,
      username: _username,
      viewMode,
      ...otherProps
    } = props

    const title = trimNewLinesAndSpaces(_title)
    if (!title) return null

    const isBot = Boolean(_username && _username.indexOf('[bot]') >= 0)
    const username =
      isBot && _username ? _username.replace('[bot]', '') : _username

    const byText = username ? `@${username}` : ''

    return (
      <BaseRow
        {...otherProps}
        left={
          Boolean(username) && (
            <Avatar
              avatarUrl={avatarUrl}
              isBot={isBot}
              linkURL={userLinkURL}
              small
              style={cardStyles.avatar}
              username={username}
            />
          )
        }
        right={
          <View style={cardRowStyles.mainContentContainer}>
            <Link
              href={fixURL(url, {
                addBottomAnchor,
                issueOrPullRequestNumber,
              })}
            >
              <SpringAnimatedText
                numberOfLines={viewMode === 'compact' ? 1 : 2}
                style={[
                  Platform.OS !== 'android' && { flexGrow: 1 },
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  cardStyles.boldText,
                  isRead &&
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                {/* <SpringAnimatedIcon
                  name={iconName}
                  size={13}
                  style={[
                    getCardStylesForTheme(springAnimatedTheme).normalText,
                    getCardStylesForTheme(springAnimatedTheme).icon,
                    { color: iconColor },
                    // isRead && { opacity: mutedOpacity },
                  ]}
                />{' '} */}
                {title}

                {!!issueOrPullRequestNumber && viewMode === 'compact' && (
                  <SpringAnimatedText
                    style={{
                      fontWeight: '400',
                      fontSize: 11,
                    }}
                  >
                    {`  #${issueOrPullRequestNumber}`}
                  </SpringAnimatedText>
                )}
              </SpringAnimatedText>
            </Link>

            <View>
              {!!labels && labels.length > 0 && (
                <>
                  <Spacer height={contentPadding / 2} />

                  <LabelsView
                    labels={labels.map(label => ({
                      key: `issue-or-pr-row-${id}-${owner}-${repo}-${issueOrPullRequestNumber}-label-${label.id ||
                        label.name}`,
                      color: label.color && `#${label.color}`,
                      name: label.name,
                    }))}
                  />
                </>
              )}

              {!!(byText || createdAt || commentsCount) &&
                viewMode !== 'compact' && (
                  <>
                    <Spacer height={contentPadding / 2} />

                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      {!!byText && (
                        <Link
                          href={
                            userLinkURL ||
                            (username && getGitHubURLForUser(username))
                          }
                        >
                          <SpringAnimatedText
                            style={[
                              getCardStylesForTheme(springAnimatedTheme)
                                .normalText,
                              cardStyles.smallText,
                              getCardStylesForTheme(springAnimatedTheme)
                                .mutedText,
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
                                {!!byText && <Text children="  " />}

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
                                  {dateText}
                                </SpringAnimatedText>
                              </>
                            )
                          }}
                        </IntervalRefresh>
                      )}

                      <Spacer flex={1} />

                      {typeof commentsCount === 'number' && commentsCount >= 0 && (
                        <CardSmallThing
                          icon="comment"
                          isRead={isRead}
                          text={commentsCount}
                          url={fixURL(url, {
                            addBottomAnchor,
                            issueOrPullRequestNumber,
                          })}
                        />
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
                  </>
                )}
            </View>
          </View>
        }
        viewMode={viewMode}
      />
    )
  },
)
