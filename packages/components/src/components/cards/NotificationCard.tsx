import React, { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'

import {
  EnhancedGitHubNotification,
  getGitHubNotificationSubItems,
  getGitHubURLForRepo,
  getGitHubURLForRepoInvitation,
  getGitHubURLForSecurityAlert,
  getNotificationIconAndColor,
  getOwnerAndRepo,
  getUserAvatarByUsername,
  GitHubNotificationReason,
  isItemRead,
  ThemeColors,
} from '@devhub/core'
import { Platform } from '../../libs/platform'
import { sharedStyles } from '../../styles/shared'
import {
  columnHeaderItemContentSize,
  contentPadding,
  mutedOpacity,
} from '../../styles/variables'
import { fixURL } from '../../utils/helpers/github/url'
import { tryFocus } from '../../utils/helpers/shared'
import { getCardBackgroundThemeColor } from '../columns/ColumnRenderer'
import { Spacer } from '../common/Spacer'
import { ThemedIcon } from '../themed/ThemedIcon'
import { ThemedView } from '../themed/ThemedView'
import { CardActions } from './partials/CardActions'
import { CardBookmarkIndicator } from './partials/CardBookmarkIndicator'
import { CardBorder } from './partials/CardBorder'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { topCardMargin } from './partials/rows/styles'
import { cardStyles, spacingBetweenLeftAndRightColumn } from './styles'

export interface NotificationCardProps {
  isFocused: boolean
  notification: EnhancedGitHubNotification
  repoIsKnown: boolean
  swipeable: boolean
}

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const { isFocused, notification, swipeable } = props

  const itemRef = useRef<View>(null)

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

  const isRead = isItemRead(notification)

  const backgroundThemeColor = useCallback(
    (theme: ThemeColors) =>
      getCardBackgroundThemeColor(theme, { muted: isRead }),
    [isRead],
  )

  const {
    comment,
    commit,
    id,
    isBot,
    isPrivate,
    isPrivateAndCantSee,
    // isRead,
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

  const showCardBorder = !Platform.supportsTouch && isFocused

  const showCardActions = !swipeable

  let withTopMargin = true
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
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!commit && (
          <CommitRow
            key={`notification-commit-row-${commit.url}`}
            authorEmail={commit.commit.author.email}
            authorName={commit.commit.author.name}
            authorUsername={commit.author && commit.author.login}
            big
            bold={!isRead}
            hideIcon
            isPrivate={isPrivate}
            latestCommentUrl={subject.latest_comment_url}
            message={commit.commit.message}
            muted={muted}
            numberOfLines={2}
            url={commit.url || commit.commit.url}
            withTopMargin={getWithTopMargin()}
          />
        )}

        {!!issueOrPullRequest && (
          <IssueOrPullRequestRow
            key={`notification-issue-or-pr-row-${issueOrPullRequest.id}`}
            addBottomAnchor={!comment}
            avatarUrl={issueOrPullRequest.user.avatar_url}
            backgroundThemeColor={backgroundThemeColor}
            body={issueOrPullRequest.body}
            bold={!isRead}
            commentsCount={
              showCardActions ? undefined : issueOrPullRequest.comments
            }
            createdAt={issueOrPullRequest.created_at}
            hideIcon
            hideLabelText={false}
            id={issueOrPullRequest.id}
            isPrivate={isPrivate}
            muted={muted}
            issueOrPullRequestNumber={issueOrPullRequestNumber!}
            labels={issueOrPullRequest.labels}
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
            withTopMargin={getWithTopMargin()}
          />
        )}
      </>
    )
  }

  const Content = renderContent()

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
              style={[
                sharedStyles.textCenter,
                {
                  fontSize: columnHeaderItemContentSize,
                  opacity: muted ? mutedOpacity : 1,
                },
              ]}
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
        </View>

        {!!showCardActions && (
          <>
            <Spacer height={topCardMargin} />

            <CardActions
              commentsCount={
                issueOrPullRequest
                  ? issueOrPullRequest.comments
                  : commit
                  ? commit.commit && commit.commit.comment_count
                  : undefined
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

NotificationCard.displayName = 'NotificationCard'
