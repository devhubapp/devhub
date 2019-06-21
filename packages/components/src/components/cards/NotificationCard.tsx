import React, { useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubNotification,
  getDateSmallText,
  getFullDateText,
  getGitHubNotificationSubItems,
  getGitHubURLForRepo,
  getGitHubURLForRepoInvitation,
  getGitHubURLForSecurityAlert,
  getNotificationIconAndColor,
  getOwnerAndRepo,
  getUserAvatarByUsername,
  GitHubNotificationReason,
} from '@devhub/core'
import { useRepoTableColumnWidth } from '../../hooks/use-repo-table-column-width'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
  smallerTextSize,
} from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
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
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { LabelsView } from './partials/rows/LabelsView'
import { NotificationReason } from './partials/rows/partials/NotificationReason'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { topCardMargin } from './partials/rows/styles'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface NotificationCardProps {
  cardViewMode: CardViewMode
  enableCompactLabels: boolean
  isFocused: boolean
  notification: EnhancedGitHubNotification
  repoIsKnown: boolean
  swipeable: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const {
    cardViewMode,
    enableCompactLabels,
    isFocused,
    notification,
    repoIsKnown,
    swipeable,
  } = props

  const itemRef = useRef<View>(null)

  const repoTableColumnWidth = useRepoTableColumnWidth()

  /*
  const hasPrivateAccess = useReduxState(state =>
    selectors.githubHasPrivateAccessToRepoSelector(
      state,
      repoOwnerName,
      repoName,
    ),
  )
  */

  useEffect(() => {
    if (Platform.OS === 'web' && isFocused && itemRef.current) {
      tryFocus(itemRef.current)
    }
  }, [isFocused])

  if (!notification) return null

  const {
    comment,
    commit,
    createdAt,
    id,
    isBot,
    isPrivate,
    isPrivateAndCantSee,
    isRead,
    isRepoInvitation,
    isSaved,
    isVulnerabilityAlert,
    issueOrPullRequest,
    issueOrPullRequestNumber,
    release,
    repo,
    repoFullName,
    subject,
    updatedAt,
  } = getGitHubNotificationSubItems(notification)

  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(repoFullName)

  const cardIconDetails = getNotificationIconAndColor(
    notification,
    (issueOrPullRequest || undefined) as any,
  )
  const cardIconName = cardIconDetails.icon
  const cardIconColor = cardIconDetails.color

  const muted = false // isRead

  const repoAvatarDetails = {
    display_login: repoName,
    login: repoFullName,
    avatar_url: getUserAvatarByUsername(repoOwnerName || ''),
    html_url: repo.html_url || getGitHubURLForRepo(repoOwnerName!, repoName!),
  }

  const showCardBorder = Platform.realOS === 'web' && isFocused

  const showCardActions = cardViewMode !== 'compact' && !swipeable

  let withTopMargin = cardViewMode !== 'compact'
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
        {/* {!!(
          repoOwnerName &&
          repoName &&
          !repoIsKnown &&
          cardViewMode === 'compact'
        ) && (
          <RepositoryRow
            key={`notification-repo-row-${repo.id}`}
            muted={muted}
            ownerName={repoOwnerName}
            repositoryName={repoName}
            small
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )} */}

        {!(commit || issueOrPullRequest || release) && !!subject.title && (
          <CommentRow
            key={`notification-${id}-subject-title-row`}
            avatarUrl=""
            body={subject.title}
            muted={muted}
            leftContent="avatar"
            maxLength={isVulnerabilityAlert ? null : undefined}
            userLinkURL=""
            username=""
            url={
              isRepoInvitation && repoOwnerName && repoName
                ? getGitHubURLForRepoInvitation(repoOwnerName, repoName)
                : isVulnerabilityAlert && repoOwnerName && repoName
                ? getGitHubURLForSecurityAlert(repoOwnerName, repoName)
                : fixURL(subject.latest_comment_url || subject.url)
            }
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!commit && (
          <CommitRow
            key={`notification-commit-row-${commit.url}`}
            authorEmail={commit.commit.author.email}
            authorName={commit.commit.author.name}
            authorUsername={commit.author && commit.author.login}
            bold={!isRead}
            isCommitMainSubject
            isPrivate={isPrivate}
            latestCommentUrl={subject.latest_comment_url}
            message={commit.commit.message}
            muted={muted}
            url={commit.url || commit.commit.url}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!issueOrPullRequest && (
          <IssueOrPullRequestRow
            key={`notification-issue-or-pr-row-${issueOrPullRequest.id}`}
            addBottomAnchor={!comment}
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
            hideIcon
            hideLabelText={false}
            id={issueOrPullRequest.id}
            inlineLabels={false}
            isPrivate={isPrivate}
            muted={muted}
            issueOrPullRequestNumber={issueOrPullRequestNumber!}
            labels={enableCompactLabels ? [] : issueOrPullRequest.labels}
            owner={repoOwnerName || ''}
            repo={repoName || ''}
            showBodyRow={
              false
              // !comment &&
              // !!(
              //   issueOrPullRequest &&
              //   issueOrPullRequest.state === 'open' &&
              //   issueOrPullRequest.body &&
              //   !(
              //     issueOrPullRequest.created_at &&
              //     issueOrPullRequest.updated_at &&
              //     new Date(issueOrPullRequest.updated_at).valueOf() -
              //       new Date(issueOrPullRequest.created_at).valueOf() >=
              //       1000 * 60 * 60 * 24
              //   )
              // )
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

        {!!release && (
          <ReleaseRow
            key={`notification-release-row-${repo.id}`}
            avatarUrl={release.author.avatar_url}
            body={release.body}
            bold={!isRead}
            hideIcon
            isPrivate={isPrivate}
            muted={muted}
            name={release.name || ''}
            ownerName={repoOwnerName || ''}
            repositoryName={repoName || ''}
            tagName={release.tag_name || ''}
            url={release.url}
            userLinkURL={release.author.html_url || ''}
            username={release.author.login || ''}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!comment && (
          <CommentRow
            key={`notification-comment-row-${comment.id}`}
            addBottomAnchor
            avatarUrl={comment.user.avatar_url}
            body={comment.body}
            muted={muted}
            leftContent="avatar"
            url={comment.html_url}
            userLinkURL={comment.user.html_url || ''}
            username={comment.user.login}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!isPrivateAndCantSee && (
          <PrivateNotificationRow
            key={`private-notification-row-${notification.id}`}
            ownerId={
              (notification.repository.owner &&
                notification.repository.owner.id) ||
              undefined
            }
            repoId={repo.id}
            viewMode={cardViewMode}
            withTopMargin={getWithTopMargin()}
          />
        )}
      </>
    )
  }

  const Content = renderContent()

  const isSingleRow = withTopMarginCount <= 1 && !release
  const alignVertically = isSingleRow

  if (cardViewMode === 'compact') {
    return (
      <ThemedView
        key={`notification-card-${id}-compact-inner`}
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
                  key={`notification-repo-row-${repo.id}`}
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

          <View style={sharedStyles.flex}>{Content}</View>
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
              width: 102,
            },
          ]}
        >
          {!!updatedAt && (
            <IntervalRefresh date={updatedAt}>
              {() => {
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
                    {dateText}
                  </ThemedText>
                )
              }}
            </IntervalRefresh>
          )}

          <NotificationReason
            backgroundThemeColor={theme =>
              getCardBackgroundThemeColor(theme, { muted: isRead })
            }
            muted={muted}
            reason={notification.reason as GitHubNotificationReason}
          />
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
            type="notifications"
          />
        </View>
      </ThemedView>
    )
  }

  return (
    <ThemedView
      key={`notification-card-${id}-inner`}
      ref={itemRef}
      backgroundColor={theme =>
        getCardBackgroundThemeColor(theme, { muted: isRead })
      }
      style={cardStyles.container}
    >
      {!!isSaved && <CardBookmarkIndicator />}
      {!!showCardBorder && <CardBorder />}

      <View style={sharedStyles.flex}>
        <View style={[{ width: '100%' }, sharedStyles.horizontal]}>
          <Spacer width={contentPadding / 3} />

          <View style={[cardStyles.itemFixedWidth, cardStyles.itemFixedHeight]}>
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
            <NotificationCardHeader
              key={`notification-card-header-${id}`}
              avatarUrl={repoAvatarDetails.avatar_url || undefined}
              backgroundThemeColor={theme =>
                getCardBackgroundThemeColor(theme, { muted: isRead })
              }
              bold={!isRead}
              date={updatedAt}
              ids={[id]}
              isBot={isBot}
              isPrivate={isPrivate}
              muted={muted}
              reason={notification.reason as GitHubNotificationReason}
              smallLeftColumn
              userLinkURL={repoAvatarDetails.html_url || ''}
              username={
                repoAvatarDetails.display_login || repoAvatarDetails.login
              }
            />
          </View>
        </View>

        <View style={[{ width: '100%' }, sharedStyles.horizontal]}>
          <Spacer width={contentPadding / 3} />

          <View style={cardStyles.itemFixedWidth} />

          <Spacer width={spacingBetweenLeftAndRightColumn} />
          <View style={sharedStyles.flex}>{Content}</View>

          <Spacer width={spacingBetweenLeftAndRightColumn} />
          <View style={cardStyles.itemFixedWidth} />

          {/* <Spacer width={contentPadding / 3} /> */}
        </View>

        {!!showCardActions && (
          <>
            <Spacer height={topCardMargin} />

            <CardActions
              commentsCount={
                issueOrPullRequest ? issueOrPullRequest.comments : undefined
              }
              commentsLink={
                (comment && (comment.html_url || comment.url)) ||
                (issueOrPullRequest &&
                  (issueOrPullRequest.html_url || issueOrPullRequest.url)) ||
                undefined
              }
              isRead={isRead}
              isSaved={isSaved}
              itemIds={[id]}
              muted={muted}
              type="notifications"
            />
          </>
        )}

        <Spacer width={contentPadding / 3} />
      </View>
    </ThemedView>
  )
})
