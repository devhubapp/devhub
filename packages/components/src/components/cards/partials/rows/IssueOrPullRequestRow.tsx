import React from 'react'
import { Text, View } from 'react-native'

import {
  getDateSmallText,
  getFullDateText,
  getGitHubURLForUser,
  GitHubLabel,
  Omit,
  stripMarkdown,
  ThemeColors,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { Platform } from '../../../../libs/platform'
import { sharedStyles } from '../../../../styles/shared'
import { contentPadding, smallAvatarSize } from '../../../../styles/variables'
import { fixURL } from '../../../../utils/helpers/github/url'
import { Avatar } from '../../../common/Avatar'
import { ConditionalWrap } from '../../../common/ConditionalWrap'
import { IntervalRefresh } from '../../../common/IntervalRefresh'
import { LabelProps } from '../../../common/Label'
import { Link } from '../../../common/Link'
import { Spacer } from '../../../common/Spacer'
import { ThemedIcon, ThemedIconProps } from '../../../themed/ThemedIcon'
import { ThemedText } from '../../../themed/ThemedText'
import { cardStyles } from '../../styles'
import { CardItemId } from '../CardItemId'
import { CardSmallThing } from '../CardSmallThing'
import { LabelsView } from './LabelsView'
import { BaseRow, BaseRowProps } from './partials/BaseRow'
import { cardRowStyles, innerCardSpacing } from './styles'

export interface IssueOrPullRequestRowProps
  extends Omit<
    BaseRowProps,
    'containerStyle' | 'contentContainerStyle' | 'left' | 'right'
  > {
  addBottomAnchor?: boolean
  avatarUrl: string | undefined
  backgroundThemeColor: LabelProps['backgroundThemeColor']
  body: string | undefined
  bold?: boolean
  commentsCount?: number
  createdAt: string | undefined
  hideIcon?: boolean
  hideLabelText?: boolean
  iconColor?: keyof ThemeColors
  iconName?: ThemedIconProps['name']
  id: string | number | undefined
  inlineLabels?: boolean
  isPrivate: boolean
  isRead: boolean
  issueOrPullRequestNumber: number
  labels?: GitHubLabel[] | undefined
  owner: string
  repo: string
  rightTitle?: React.ReactNode
  showBodyRow: boolean
  showCreationDetails: boolean
  title: string
  updatedAt?: string | undefined
  url: string
  userLinkURL: string | undefined
  username: string | undefined
}

export const IssueOrPullRequestRow = React.memo(
  (props: IssueOrPullRequestRowProps) => {
    const {
      addBottomAnchor,
      avatarUrl,
      backgroundThemeColor,
      body: _body,
      bold,
      commentsCount,
      createdAt,
      hideIcon,
      hideLabelText,
      iconColor,
      iconName = 'issue-opened',
      id,
      inlineLabels: _inlineLabels,
      isPrivate,
      isRead,
      issueOrPullRequestNumber,
      labels,
      owner,
      repo,
      rightTitle,
      showBodyRow,
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

    const body = trimNewLinesAndSpaces(stripMarkdown(`${_body || ''}`), 150)
    const isBot = Boolean(_username && _username.indexOf('[bot]') >= 0)
    const numberOfLines = viewMode === 'compact' ? 1 : 2
    const username =
      isBot && _username ? _username.replace('[bot]', '') : _username
    const byText = username ? `@${username}` : ''
    const htmlUrl = fixURL(url, {
      addBottomAnchor,
      issueOrPullRequestNumber,
    })

    const inlineLabels =
      typeof _inlineLabels === 'boolean'
        ? _inlineLabels
        : viewMode === 'compact' &&
          numberOfLines === 1 &&
          (hideLabelText ? labels && labels.length <= 20 : true)
    const keepLabelsTogether = true

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
            <ThemedIcon color="orange" name="lock" size={smallAvatarSize} />
          ) : null
        }
        right={
          <View style={cardRowStyles.mainContentContainer}>
            <View
              style={[
                sharedStyles.flex,
                {
                  justifyContent: keepLabelsTogether
                    ? 'space-between'
                    : 'flex-start',
                  width: '100%',
                },
                inlineLabels && sharedStyles.horizontal,
                inlineLabels && sharedStyles.flexWrap,
              ]}
            >
              <ConditionalWrap
                condition={!!rightTitle}
                wrap={c => (
                  <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
                    <View style={sharedStyles.flex}>{c}</View>

                    <Spacer width={contentPadding / 2} />

                    <View style={{ alignSelf: 'flex-start' }}>
                      {rightTitle}
                    </View>
                  </View>
                )}
              >
                <Link
                  enableTextWrapper
                  href={htmlUrl}
                  style={[
                    !inlineLabels && !rightTitle && sharedStyles.flexGrow,
                    { alignSelf: 'flex-start' },
                    !!inlineLabels &&
                      labels &&
                      labels.length > 0 && { marginRight: contentPadding / 2 },
                    !inlineLabels &&
                      labels &&
                      labels.length > 0 && { marginBottom: innerCardSpacing },
                  ]}
                  textProps={{
                    color: isRead
                      ? 'foregroundColorMuted60'
                      : 'foregroundColor',
                    // color: 'foregroundColor',
                    numberOfLines,
                    style: [
                      sharedStyles.flex,
                      cardStyles.normalText,
                      bold && cardStyles.boldText,
                      // isRead && { fontWeight: undefined },
                    ],
                  }}
                  // tooltip={`${title}${_body ? `\n\n${_body}` : ''}`}
                >
                  <>
                    {!hideIcon && (
                      <>
                        <ThemedIcon
                          color={iconColor}
                          name={iconName}
                          size={13}
                          style={[cardStyles.normalText, cardStyles.icon]}
                        />{' '}
                      </>
                    )}
                    {title}

                    {/* {!!issueOrPullRequestNumber &&
                    (viewMode === 'compact' || !showCreationDetails) &&
                    ` #${issueOrPullRequestNumber}`} */}
                  </>
                </Link>
              </ConditionalWrap>

              {!!labels && labels.length > 0 && (
                <LabelsView
                  backgroundThemeColor={backgroundThemeColor}
                  borderThemeColor={
                    hideLabelText && backgroundThemeColor
                      ? backgroundThemeColor
                      : undefined
                  }
                  fragment={!keepLabelsTogether}
                  hideText={hideLabelText}
                  labels={labels.map(label => ({
                    key: `issue-or-pr-row-${id}-${owner}-${repo}-${issueOrPullRequestNumber}-label-${label.id ||
                      label.name}`,
                    color: label.color && `#${label.color}`,
                    name: label.name,
                  }))}
                  muted={isRead}
                  textThemeColor="foregroundColorMuted60"
                />
              )}
            </View>

            <View style={{ alignSelf: 'stretch', maxWidth: '100%' }}>
              {!!showBodyRow && !!body && (
                <>
                  <Spacer height={innerCardSpacing} />

                  <Link
                    href={htmlUrl}
                    style={cardRowStyles.mainContentContainer}
                    textProps={{
                      color: isRead
                        ? 'foregroundColorMuted60'
                        : 'foregroundColor',
                      // color: 'foregroundColor',
                      numberOfLines,
                      style: [sharedStyles.flex, cardStyles.commentText],
                    }}
                  >
                    {body}
                  </Link>
                </>
              )}

              {!!(byText || createdAt || updatedAt || commentsCount) &&
                showCreationDetails && (
                  <>
                    <Spacer height={innerCardSpacing} />

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
                          textProps={{
                            color: 'foregroundColorMuted60',
                            style: [cardStyles.smallerText],
                          }}
                        >
                          {byText}
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

                                <ThemedText
                                  color="foregroundColorMuted60"
                                  numberOfLines={1}
                                  style={cardStyles.smallerText}
                                  {...Platform.select({
                                    web: {
                                      title: `Created: ${getFullDateText(
                                        createdAt,
                                      )}`,
                                    },
                                  })}
                                >
                                  {dateText}
                                </ThemedText>
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

                                <ThemedText
                                  color="foregroundColorMuted60"
                                  numberOfLines={1}
                                  style={cardStyles.smallerText}
                                  {...Platform.select({
                                    web: {
                                      title: `Updated: ${getFullDateText(
                                        updatedAt,
                                      )}`,
                                    },
                                  })}
                                >
                                  <ThemedIcon
                                    name="clock"
                                    style={cardStyles.smallerText}
                                  />{' '}
                                  {dateText}
                                </ThemedText>
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
