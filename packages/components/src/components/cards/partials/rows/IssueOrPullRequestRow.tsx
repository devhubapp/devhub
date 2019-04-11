import React from 'react'
import { Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubLabel,
  Omit,
  stripMarkdown,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../../../libs/platform'
import * as colors from '../../../../styles/colors'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding, smallAvatarSize } from '../../../../styles/variables'
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
import { LabelsView } from './LabelsView'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles, innerCardMarginTop } from './styles'

export interface IssueOrPullRequestRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  addBottomAnchor?: boolean
  avatarUrl: string | undefined
  body: string | undefined
  bold?: boolean
  commentsCount?: number
  createdAt: string | undefined
  hideIcon?: boolean
  iconColor?: string
  iconName?: SpringAnimatedIconProps['name']
  id: string | number | undefined
  isPrivate: boolean
  isRead: boolean
  issueOrPullRequestNumber: number
  labels?: GitHubLabel[] | undefined
  owner: string
  repo: string
  showCreationDetails: boolean
  title: string
  updatedAt?: string | undefined
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
      body: _body,
      bold,
      commentsCount,
      createdAt,
      hideIcon,
      iconColor,
      iconName = 'issue-opened',
      id,
      isPrivate,
      isRead,
      issueOrPullRequestNumber,
      labels,
      owner,
      repo,
      showCreationDetails,
      title: _title,
      updatedAt,
      url,
      userLinkURL,
      username: _username,
      viewMode,
      ...otherProps
    } = props

    const title = trimNewLinesAndSpaces(_title)
    if (!title) return null

    const body = trimNewLinesAndSpaces(
      stripMarkdown(`${_body || ''}`),
      Platform.select({ default: 400, web: 150 }),
    )

    const isBot = Boolean(_username && _username.indexOf('[bot]') >= 0)

    const numberOfLines = viewMode === 'compact' ? 1 : 2

    const username =
      isBot && _username ? _username.replace('[bot]', '') : _username

    const byText = username ? `@${username}` : ''

    const htmlUrl = fixURL(url, {
      addBottomAnchor,
      issueOrPullRequestNumber,
    })

    return (
      <BaseRow
        {...otherProps}
        left={
          username ? (
            <Avatar
              avatarUrl={avatarUrl}
              isBot={isBot}
              linkURL={userLinkURL}
              small
              style={cardStyles.avatar}
              username={username}
            />
          ) : isPrivate ? (
            <SpringAnimatedIcon
              name="lock"
              size={smallAvatarSize}
              style={{ color: colors.orange }}
            />
          ) : null
        }
        right={
          <View style={cardRowStyles.mainContentContainer}>
            <Link href={htmlUrl}>
              <SpringAnimatedText
                numberOfLines={numberOfLines}
                style={[
                  sharedStyles.flex,
                  getCardStylesForTheme(springAnimatedTheme).normalText,
                  bold && cardStyles.boldText,
                  isRead &&
                    getCardStylesForTheme(springAnimatedTheme).mutedText,
                ]}
              >
                {!hideIcon && (
                  <>
                    <SpringAnimatedIcon
                      name={iconName}
                      size={13}
                      style={[
                        getCardStylesForTheme(springAnimatedTheme).normalText,
                        getCardStylesForTheme(springAnimatedTheme).icon,
                        { color: iconColor },
                        // isRead && { opacity: mutedOpacity },
                      ]}
                    />{' '}
                  </>
                )}
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

            <View style={{ alignSelf: 'stretch', maxWidth: '100%' }}>
              {!!body && (
                <>
                  <Spacer height={innerCardMarginTop} />

                  <Link
                    href={htmlUrl}
                    style={cardRowStyles.mainContentContainer}
                  >
                    <SpringAnimatedText
                      numberOfLines={numberOfLines}
                      style={[
                        sharedStyles.flex,
                        getCardStylesForTheme(springAnimatedTheme).commentText,
                        isRead &&
                          getCardStylesForTheme(springAnimatedTheme).mutedText,
                      ]}
                    >
                      {body}
                    </SpringAnimatedText>
                  </Link>
                </>
              )}

              {!!labels && labels.length > 0 && (
                <>
                  <Spacer height={innerCardMarginTop} />

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

              {!!(byText || createdAt || updatedAt || commentsCount) &&
                showCreationDetails && (
                  <>
                    <Spacer height={innerCardMarginTop} />

                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignSelf: 'stretch',
                        alignItems: 'center',
                      }}
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
                                .smallerMutedText,
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
                                      .smallerMutedText
                                  }
                                  {...Platform.select({
                                    web: {
                                      title: `Created: ${getFullDateText(
                                        createdAt,
                                      )}`,
                                    },
                                  })}
                                >
                                  {dateText}
                                </SpringAnimatedText>
                              </>
                            )
                          }}
                        </IntervalRefresh>
                      )}

                      {!!updatedAt && (
                        <IntervalRefresh date={updatedAt}>
                          {() => {
                            const dateText = getDateSmallText(updatedAt, false)
                            if (!dateText) return null

                            return (
                              <>
                                {!!byText && <Text children="  " />}

                                <SpringAnimatedText
                                  numberOfLines={1}
                                  style={
                                    getCardStylesForTheme(springAnimatedTheme)
                                      .smallerMutedText
                                  }
                                  {...Platform.select({
                                    web: {
                                      title: `Updated: ${getFullDateText(
                                        updatedAt,
                                      )}`,
                                    },
                                  })}
                                >
                                  <SpringAnimatedIcon name="clock" /> {dateText}
                                </SpringAnimatedText>
                              </>
                            )
                          }}
                        </IntervalRefresh>
                      )}

                      {viewMode === 'compact' ? (
                        <Spacer width={contentPadding / 2} />
                      ) : (
                        <Spacer flex={1} />
                      )}

                      {typeof commentsCount === 'number' &&
                        commentsCount >= 0 && (
                          <CardSmallThing
                            icon="comment"
                            isRead={isRead}
                            text={commentsCount}
                            url={htmlUrl}
                          />
                        )}

                      {viewMode !== 'compact' && (
                        <>
                          <Spacer width={contentPadding / 2} />

                          <CardItemId
                            id={issueOrPullRequestNumber}
                            isRead={isRead}
                            url={htmlUrl}
                          />
                        </>
                      )}
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
