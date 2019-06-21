import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubIssueOrPullRequest,
  getDateSmallText,
  getFullDateText,
  getGitHubURLForRepo,
  getIssueOrPullRequestIconAndColor,
  getIssueOrPullRequestNumberFromUrl,
  getItemIsBot,
  getOwnerAndRepo,
  getRepoFullNameFromUrl,
  GitHubIssueOrPullRequestSubjectType,
  isItemRead,
} from '@devhub/core'
import { useRepoTableColumnWidth } from '../../hooks/use-repo-table-column-width'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
  smallAvatarSize,
  smallerTextSize,
} from '../../styles/variables'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Avatar } from '../common/Avatar'
import { BookmarkButton } from '../common/BookmarkButton'
import { IntervalRefresh } from '../common/IntervalRefresh'
import { Spacer } from '../common/Spacer'
import { ToggleReadButton } from '../common/ToggleReadButton'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedText } from '../themed/ThemedText'
import { ThemedView } from '../themed/ThemedView'
import { CardActions } from './partials/CardActions'
import { CardBookmarkIndicator } from './partials/CardBookmarkIndicator'
import { CardBorder } from './partials/CardBorder'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { LabelsView } from './partials/rows/LabelsView'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { topCardMargin } from './partials/rows/styles'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface IssueOrPullRequestCardProps {
  cardViewMode: CardViewMode
  enableCompactLabels: boolean
  isFocused?: boolean
  isPrivate?: boolean
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  repoIsKnown: boolean
  swipeable: boolean
  type: GitHubIssueOrPullRequestSubjectType
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const {
      cardViewMode,
      enableCompactLabels,
      isFocused,
      isPrivate,
      issueOrPullRequest,
      repoIsKnown,
      swipeable,
      type,
    } = props

    const itemRef = useRef<View>(null)

    const repoTableColumnWidth = useRepoTableColumnWidth()

    useEffect(() => {
      if (Platform.OS === 'web' && isFocused && itemRef.current) {
        tryFocus(itemRef.current)
      }
    }, [isFocused])

    if (!issueOrPullRequest) return null

    const {
      id,
      repository_url,
      saved,
      url,
      html_url: htmlURL,
    } = issueOrPullRequest as EnhancedGitHubIssueOrPullRequest

    const repoFullName = getRepoFullNameFromUrl(
      repository_url || url || htmlURL,
    )
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const issueOrPullRequestNumber = issueOrPullRequest
      ? issueOrPullRequest.number ||
        getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
      : undefined

    const isRead = isItemRead(issueOrPullRequest)
    const isSaved = saved === true
    const muted = false // isRead
    const showCardBorder = Platform.realOS === 'web' && isFocused

    const repo = {
      id: '',
      fork: false,
      private: false,
      full_name: repoFullName,
      owner: { login: repoOwnerName } as any,
      name: repoName,
      url: repository_url || getGitHubURLForRepo(repoOwnerName!, repoName!)!,
      html_url: getGitHubURLForRepo(repoOwnerName!, repoName!)!,
    }

    const isBot = getItemIsBot('issue_or_pr', issueOrPullRequest)

    const cardIconDetails = getIssueOrPullRequestIconAndColor(
      type,
      issueOrPullRequest,
    )
    const cardIconName = cardIconDetails.icon
    const cardIconColor = cardIconDetails.color

    const showCardActions = cardViewMode !== 'compact' && !swipeable

    let withTopMargin = false
    let withTopMarginCount = withTopMargin ? 1 : 0
    function getWithTopMargin() {
      const _withTopMargin = withTopMargin
      withTopMargin = true
      withTopMarginCount = withTopMarginCount + 1
      return _withTopMargin
    }

    function renderContent() {
      return (
        <>
          {!!(
            repoOwnerName &&
            repoName &&
            !repoIsKnown &&
            cardViewMode !== 'compact'
          ) && (
            <RepositoryRow
              key={`issue-or-pr-repo-row-${repo.id}`}
              muted={muted}
              ownerName={repoOwnerName}
              repositoryName={repoName}
              small
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}

          {!!issueOrPullRequest && (
            <IssueOrPullRequestRow
              key={`issue-or-pr-issue-or-pr-row-${issueOrPullRequest.id}`}
              addBottomAnchor={false}
              avatarUrl={issueOrPullRequest.user.avatar_url}
              backgroundThemeColor={theme =>
                getCardBackgroundThemeColor(theme, { muted: isRead })
              }
              body={issueOrPullRequest.body}
              bold={!isRead}
              commentsCount={
                showCardActions ? undefined : issueOrPullRequest.comments
              }
              createdAt={issueOrPullRequest.created_at}
              // updatedAt={issueOrPullRequest.updated_at}
              hideIcon
              hideLabelText={false}
              // iconColor={issueIconColor || pullRequestIconColor}
              // iconName={issueIconName! || pullRequestIconName}
              id={issueOrPullRequest.id}
              isPrivate={!!isPrivate}
              muted={muted}
              issueOrPullRequestNumber={issueOrPullRequestNumber!}
              labels={enableCompactLabels ? [] : issueOrPullRequest.labels}
              owner={repoOwnerName || ''}
              repo={repoName || ''}
              rightTitle={
                !!issueOrPullRequest.updated_at &&
                cardViewMode !== 'compact' && (
                  <View
                    style={[
                      cardStyles.compactItemFixedHeight,
                      sharedStyles.horizontal,
                    ]}
                  >
                    <IntervalRefresh date={issueOrPullRequest.updated_at}>
                      {() => {
                        const createdAt = issueOrPullRequest.created_at
                        const updatedAt = issueOrPullRequest.updated_at

                        const dateText = getDateSmallText(updatedAt, false)
                        if (!dateText) return null

                        return (
                          <>
                            <ThemedText
                              color={
                                muted
                                  ? 'foregroundColorMuted40'
                                  : 'foregroundColorMuted60'
                              }
                              numberOfLines={1}
                              style={cardStyles.smallerText}
                              {...Platform.select({
                                web: {
                                  title: `${
                                    createdAt
                                      ? `Created: ${getFullDateText(
                                          createdAt,
                                        )}\n`
                                      : ''
                                  }Updated: ${getFullDateText(updatedAt)}`,
                                },
                              })}
                            >
                              {/* <ThemedIcon
                                name="clock"
                                style={cardStyles.smallerText}
                              />{' '} */}
                              {dateText}
                            </ThemedText>
                          </>
                        )
                      }}
                    </IntervalRefresh>

                    <Spacer width={contentPadding / 3} />
                  </View>
                )
              }
              showBodyRow={
                false
                // issueOrPullRequest &&
                // issueOrPullRequest.state === 'open' &&
                // issueOrPullRequest.body
                //   ? true
                //   : false
              }
              showCreationDetails={false}
              title={issueOrPullRequest.title}
              url={issueOrPullRequest.url}
              userLinkURL={issueOrPullRequest.user.html_url || ''}
              username={issueOrPullRequest.user.login || ''}
              viewMode={cardViewMode}
              withTopMargin={getWithTopMargin()}
            />
          )}
        </>
      )
    }

    const Content = renderContent()

    const isSingleRow = withTopMarginCount <= 1
    const alignVertically = isSingleRow

    if (cardViewMode === 'compact') {
      return (
        <ThemedView
          key={`issue-or-pr-card-${id}-compact-inner`}
          ref={itemRef}
          backgroundColor={theme =>
            getCardBackgroundThemeColor(theme, { muted: isRead })
          }
          style={[
            cardStyles.compactContainer,
            alignVertically && { alignItems: 'center' },
          ]}
        >
          {!!showCardBorder && <CardBorder />}

          {/* <CenterGuide /> */}

          {/* <View
          style={[cardStyles.compactItemFixedWidth, cardStyles.compactItemFixedHeight]}
        >
          <Checkbox analyticsLabel={undefined} size={columnHeaderItemContentSize} />
        </View>

        <Spacer width={contentPadding} /> */}

          <View style={cardStyles.compactItemFixedHeight}>
            <BookmarkButton
              isSaved={isSaved}
              itemIds={id}
              size={columnHeaderItemContentSize}
            />
          </View>

          <Spacer
            width={
              spacingBetweenLeftAndRightColumn - columnHeaderItemContentSize / 4
            }
          />

          {!repoIsKnown && (
            <>
              <View
                style={[
                  cardStyles.compactItemFixedWidth,
                  cardStyles.compactItemFixedHeight,
                ]}
              >
                <Avatar
                  isBot={isBot}
                  linkURL=""
                  muted={muted}
                  small
                  size={smallAvatarSize}
                  username={repoOwnerName}
                />
              </View>

              <Spacer width={spacingBetweenLeftAndRightColumn} />

              <View
                style={[
                  cardStyles.compactItemFixedMinHeight,
                  {
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: repoTableColumnWidth,
                    overflow: 'hidden',
                  },
                ]}
              >
                {!!(repoOwnerName && repoName) && (
                  <RepositoryRow
                    key={`issue-or-pr-repo-row-${repoOwnerName}-${repoName}`}
                    disableLeft
                    hideOwner
                    muted={muted}
                    ownerName={repoOwnerName}
                    repositoryName={repoName}
                    rightContainerStyle={{
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      width: repoTableColumnWidth,
                    }}
                    small
                    viewMode={cardViewMode}
                    withTopMargin={false}
                  />
                )}
              </View>

              <Spacer width={spacingBetweenLeftAndRightColumn} />
            </>
          )}

          <View
            style={[
              sharedStyles.flex,
              sharedStyles.horizontal,
              { alignItems: 'flex-start' },
            ]}
          >
            <View
              style={[
                cardStyles.compactItemFixedWidth,
                cardStyles.compactItemFixedHeight,
              ]}
            >
              <ThemedIcon
                color={cardIconColor || 'foregroundColor'}
                name={cardIconName}
                selectable={false}
                style={{
                  fontSize: columnHeaderItemContentSize,
                  textAlign: 'center',
                  opacity: muted ? mutedOpacity : 1,
                }}
                {...!!cardIconDetails.tooltip &&
                  Platform.select({
                    web: { title: cardIconDetails.tooltip },
                  })}
              />
            </View>

            <Spacer width={spacingBetweenLeftAndRightColumn} />

            <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
              <View style={sharedStyles.flex}>{Content}</View>

              <Spacer width={contentPadding / 3} />
            </View>
          </View>

          <Spacer width={spacingBetweenLeftAndRightColumn} />

          {!!enableCompactLabels &&
            !!issueOrPullRequest &&
            !!issueOrPullRequest.labels &&
            issueOrPullRequest.labels.length > 0 && (
              <>
                <LabelsView
                  backgroundThemeColor={theme =>
                    getCardBackgroundThemeColor(theme, { muted: isRead })
                  }
                  enableScrollView={isSingleRow}
                  labels={issueOrPullRequest.labels.map(label => ({
                    key: `issue-or-pr-row-${
                      issueOrPullRequest.id
                    }-${issueOrPullRequestNumber}-label-${label.id ||
                      label.name}`,
                    color: label.color && `#${label.color}`,
                    name: label.name,
                  }))}
                  muted={muted}
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'flex-end',
                    maxWidth:
                      260 +
                      (repoIsKnown ? repoTableColumnWidth + 20 : 0) +
                      (`${issueOrPullRequest.title || ''}`.length <= 50
                        ? 100
                        : 0),
                    overflow: 'hidden',
                  }}
                  textThemeColor={
                    muted ? 'foregroundColorMuted40' : 'foregroundColorMuted60'
                  }
                />

                <Spacer width={spacingBetweenLeftAndRightColumn} />
              </>
            )}

          <View
            style={[
              cardStyles.compactItemFixedMinHeight,
              {
                alignSelf: 'center',
                alignItems: 'flex-end',
                width: 60,
              },
            ]}
          >
            {!!issueOrPullRequest.created_at && (
              <IntervalRefresh date={issueOrPullRequest.created_at}>
                {() => {
                  const createdAt = issueOrPullRequest.created_at
                  const updatedAt = issueOrPullRequest.updated_at

                  const dateText = getDateSmallText(updatedAt, false)
                  if (!dateText) return null

                  return (
                    <ThemedText
                      color={
                        muted
                          ? 'foregroundColorMuted40'
                          : 'foregroundColorMuted60'
                      }
                      numberOfLines={1}
                      style={[
                        cardStyles.timestampText,
                        cardStyles.smallText,
                        { fontSize: smallerTextSize },
                      ]}
                      {...Platform.select({
                        web: {
                          title: `${
                            createdAt
                              ? `Created: ${getFullDateText(createdAt)}\n`
                              : ''
                          }Updated: ${getFullDateText(updatedAt)}`,
                        },
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
                      {/* <ThemedIcon name="clock" />{' '} */}
                      {dateText}
                    </ThemedText>
                  )
                }}
              </IntervalRefresh>
            )}
          </View>

          <Spacer width={contentPadding / 2} />

          <View
            style={[
              cardStyles.compactItemFixedHeight,
              {
                alignSelf: 'center',
              },
            ]}
          >
            <ToggleReadButton
              isRead={isRead}
              itemIds={id}
              muted={muted}
              size={columnHeaderItemContentSize}
              type="issue_or_pr"
            />
          </View>
        </ThemedView>
      )
    }

    return (
      <ThemedView
        key={`issue-or-pr-card-${id}-inner`}
        ref={itemRef}
        backgroundColor={theme =>
          getCardBackgroundThemeColor(theme, { muted: isRead })
        }
        style={cardStyles.container}
      >
        {!!isSaved && <CardBookmarkIndicator />}
        {!!showCardBorder && <CardBorder />}

        <View style={sharedStyles.flex}>
          <View
            style={[
              { alignItems: 'flex-start', width: '100%' },
              sharedStyles.horizontal,
            ]}
          >
            <Spacer width={contentPadding / 3} />

            <View
              style={[cardStyles.itemFixedWidth, cardStyles.itemFixedMinHeight]}
            >
              <ThemedIcon
                color={cardIconColor || 'foregroundColor'}
                name={cardIconName}
                selectable={false}
                style={{
                  fontSize: columnHeaderItemContentSize,
                  textAlign: 'center',
                  opacity: muted ? mutedOpacity : 1,
                }}
                {...!!cardIconDetails.tooltip &&
                  Platform.select({
                    web: { title: cardIconDetails.tooltip },
                  })}
              />
            </View>

            <Spacer width={spacingBetweenLeftAndRightColumn} />

            <View style={sharedStyles.flex}>
              {/* <IssueOrPullRequestCardHeader
              key={`issue-or-pr-card-header-${id}`}
              actionText=""
              avatarUrl={avatarUrl}
              backgroundThemeColor={backgroundThemeColor}
              cardIconColor={cardIconColor}
              cardIconName={cardIconName}
              date={issueOrPullRequest.created_at}
              ids={
                ('merged' in issueOrPullRequest &&
                  issueOrPullRequest.merged) || [id]
              }
              isBot={isBot}
              isPrivate={isPrivate}
              isSaved={isSaved}
              muted={muted}
              smallLeftColumn={false}
              userLinkURL={actor.html_url || ''}
              username={actor.display_login || actor.login}
            /> */}

              <View style={[sharedStyles.flex, sharedStyles.horizontal]}>
                {/* <Spacer width={leftColumnBigSize - leftColumnSmallSize} /> */}

                <View style={sharedStyles.flex}>{Content}</View>
              </View>
            </View>
          </View>

          {!!showCardActions && (
            <>
              <Spacer height={topCardMargin} />

              <CardActions
                commentsCount={
                  issueOrPullRequest ? issueOrPullRequest.comments : undefined
                }
                commentsLink={
                  (issueOrPullRequest &&
                    (issueOrPullRequest.html_url || issueOrPullRequest.url)) ||
                  undefined
                }
                isRead={isRead}
                isSaved={isSaved}
                itemIds={[id]}
                muted={muted}
                type="issue_or_pr"
              />
            </>
          )}

          <Spacer width={contentPadding / 3} />
        </View>
      </ThemedView>
    )
  },
)
