import React, { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  EnhancedGitHubNotification,
  getGitHubURLForRepo,
  getGitHubURLForRepoInvitation,
  getGitHubURLForSecurityAlert,
  getIssueOrPullRequestNumberFromUrl,
  getOwnerAndRepo,
  getUserAvatarByUsername,
  GitHubNotificationReason,
  isItemRead,
  isNotificationPrivate,
  trimNewLinesAndSpaces,
} from '@devhub/core'
import { useReduxState } from '../../hooks/use-redux-state'
import * as selectors from '../../redux/selectors'
import * as colors from '../../styles/colors'
import { contentPadding } from '../../styles/variables'
import {
  getIssueIconAndColor,
  getNotificationIconAndColor,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { fixURL } from '../../utils/helpers/github/url'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { PrivateNotificationRow } from './partials/rows/PrivateNotificationRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'

export interface NotificationCardProps {
  isSelected?: boolean
  notification: EnhancedGitHubNotification
  onlyOneRepository?: boolean
  repoIsKnown?: boolean
}

const styles = StyleSheet.create({
  container: {
    padding: contentPadding,
  },
})

export const NotificationCard = React.memo((props: NotificationCardProps) => {
  const { notification, onlyOneRepository, isSelected } = props

  const repoFullName =
    (notification &&
      (notification.repository.full_name || notification.repository.name)) ||
    ''

  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(repoFullName)

  const itemRef = useRef<View>(null)
  const springAnimatedTheme = useSpringAnimatedTheme()

  /*
  const hasPrivateAccess = useReduxState(state =>
    selectors.githubHasPrivateAccessToRepoSelector(
      state,
      repoOwnerName,
      repoName,
    ),
  )
  */

  useEffect(
    () => {
      if (isSelected && itemRef.current) itemRef.current.focus()
    },
    [isSelected],
  )

  if (!notification) return null

  const {
    comment,
    id,
    repository: repo,
    saved,
    subject,
    updated_at: updatedAt,
  } = notification

  if (!subject) return null

  const isRead = isItemRead(notification)
  const isSaved = saved === true
  const isPrivate = isNotificationPrivate(notification)

  const isPrivateAndCantSee = !!(
    isPrivate &&
    // !hasPrivateAccess &&
    !notification.enhanced
  )

  const title = trimNewLinesAndSpaces(subject.title)

  const subjectType = subject.type || ''

  const commit =
    notification.commit ||
    (subjectType === 'Commit' && {
      author: { avatar_url: '', login: '', html_url: '' },
      commit: {
        author: {
          name: '',
          email: '',
        },
        message: subject.title,
        url: subject.url,
      },
      url: subject.url,
    }) ||
    null

  const issue =
    notification.issue ||
    (subjectType === 'Issue' && {
      id: undefined,
      body: undefined,
      comments: undefined,
      created_at: undefined,
      labels: [],
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const pullRequest =
    notification.pullRequest ||
    (subjectType === 'PullRequest' && {
      id: undefined,
      body: undefined,
      created_at: undefined,
      comments: undefined,
      labels: [],
      draft: false,
      state: undefined,
      title: subject.title,
      url: subject.latest_comment_url || subject.url,
      user: { avatar_url: '', login: '', html_url: '' },
    }) ||
    null

  const release =
    notification.release ||
    (subjectType === 'Release' && {
      id: undefined,
      author: { avatar_url: '', login: '', html_url: '' },
      body: '',
      created_at: undefined,
      name: subject.title,
      tag_name: '',
      url: subject.latest_comment_url || subject.url,
    }) ||
    null

  const isRepoInvitation = subjectType === 'RepositoryInvitation'
  const isVulnerabilityAlert = subjectType === 'RepositoryVulnerabilityAlert'

  const cardIconDetails = getNotificationIconAndColor(notification, (issue ||
    pullRequest ||
    undefined) as any)
  const cardIconName = isPrivateAndCantSee ? 'lock' : cardIconDetails.icon
  const cardIconColor = isPrivateAndCantSee
    ? colors.yellow
    : cardIconDetails.color

  const { icon: pullRequestIconName, color: pullRequestIconColor } = pullRequest
    ? getPullRequestIconAndColor(pullRequest as any)
    : { icon: undefined, color: undefined }

  const { icon: issueIconName, color: issueIconColor } = issue
    ? getIssueIconAndColor(issue as any)
    : { icon: undefined, color: undefined }

  const issueOrPullRequestNumber =
    issue || pullRequest
      ? getIssueOrPullRequestNumberFromUrl((issue || pullRequest)!.url)
      : undefined

  // TODO: Show user actor + action text like activity events?
  const actor = {
    display_login: repoName,
    login: repoFullName,
    avatar_url: getUserAvatarByUsername(repoOwnerName || ''),
    html_url: repo.html_url || getGitHubURLForRepo(repoOwnerName!, repoName!),
  }
  const actionText = ''

  const isBot = Boolean(actor.login && actor.login.indexOf('[bot]') >= 0)

  const smallLeftColumn = false

  return (
    <SpringAnimatedView
      key={`notification-card-${id}-inner`}
      ref={itemRef}
      style={[
        styles.container,
        {
          backgroundColor:
            (isSelected && springAnimatedTheme.backgroundColorLess2) ||
            (isRead && springAnimatedTheme.backgroundColorDarker1) ||
            springAnimatedTheme.backgroundColor,
        },
      ]}
    >
      <NotificationCardHeader
        key={`notification-card-header-${id}`}
        actionText={actionText}
        avatarUrl={actor && actor.avatar_url}
        cardIconColor={cardIconColor}
        cardIconName={cardIconName}
        date={updatedAt}
        ids={[id]}
        isBot={isBot}
        isPrivate={isPrivate}
        isRead={isRead}
        isSaved={isSaved}
        reason={notification.reason as GitHubNotificationReason}
        smallLeftColumn={smallLeftColumn}
        userLinkURL={actor.html_url || ''}
        username={actor.display_login || actor.login}
      />

      {!!(
        repoOwnerName &&
        repoName &&
        !onlyOneRepository &&
        !(
          (actor &&
            (actor.display_login === repoName || actor.login === repoName)) ||
          (actor.display_login === repoFullName || actor.login === repoFullName)
        )
      ) && (
        <RepositoryRow
          key={`notification-repo-row-${repo.id}`}
          isRead={isRead}
          ownerName={repoOwnerName}
          repositoryName={repoName}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {!!commit && (
        <CommitRow
          key={`notification-commit-row-${commit.url}`}
          authorEmail={commit.commit.author.email}
          authorName={commit.commit.author.name}
          authorUsername={commit.author && commit.author.login}
          isRead={isRead}
          latestCommentUrl={subject.latest_comment_url}
          message={commit.commit.message}
          smallLeftColumn={smallLeftColumn}
          url={commit.url || commit.commit.url}
        />
      )}

      {!!issue && (
        <IssueOrPullRequestRow
          key={`notification-issue-row-${issueOrPullRequestNumber}`}
          addBottomAnchor
          avatarUrl={issue.user.avatar_url}
          commentsCount={issue.comments}
          createdAt={issue.created_at}
          iconColor={issueIconColor!}
          iconName={issueIconName!}
          id={issue.id}
          isRead={isRead}
          issueOrPullRequestNumber={issueOrPullRequestNumber!}
          labels={issue.labels}
          owner={repoOwnerName || ''}
          repo={repoName || ''}
          smallLeftColumn={smallLeftColumn}
          title={issue.title}
          url={issue.url}
          userLinkURL={issue.user.html_url || ''}
          username={issue.user.login || ''}
        />
      )}

      {!comment &&
        !!(
          issue &&
          issue.state === 'open' &&
          issue.body &&
          !(
            issue.created_at &&
            issue.updated_at &&
            new Date(issue.updated_at).valueOf() -
              new Date(issue.created_at).valueOf() >=
              1000 * 60 * 60 * 24
          )
        ) && (
          // only show body if this notification is probably from a creation event
          // because it may be for other updates
          <CommentRow
            key={`notification-issue-body-${issue.id}`}
            avatarUrl={issue.user.avatar_url}
            body={issue.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={issue.html_url}
            userLinkURL={issue.user.html_url || ''}
            username={issue.user.login}
          />
        )}

      {!!pullRequest && (
        <IssueOrPullRequestRow
          key={`notification-pr-row-${issueOrPullRequestNumber}`}
          addBottomAnchor
          avatarUrl={pullRequest.user.avatar_url}
          commentsCount={pullRequest.comments}
          createdAt={pullRequest.created_at}
          iconColor={pullRequestIconColor!}
          iconName={pullRequestIconName!}
          id={pullRequest.id}
          isRead={isRead}
          issueOrPullRequestNumber={issueOrPullRequestNumber!}
          labels={pullRequest.labels}
          owner={repoOwnerName || ''}
          repo={repoName || ''}
          smallLeftColumn={smallLeftColumn}
          title={pullRequest.title}
          url={pullRequest.url}
          userLinkURL={pullRequest.user.html_url || ''}
          username={pullRequest.user.login || ''}
        />
      )}

      {!comment &&
        !!(
          pullRequest &&
          pullRequest.state === 'open' &&
          pullRequest.body &&
          !(
            pullRequest.created_at &&
            pullRequest.updated_at &&
            new Date(pullRequest.updated_at).valueOf() -
              new Date(pullRequest.created_at).valueOf() >=
              1000 * 60 * 60 * 24
          )
        ) && (
          // only show body if this notification is probably from a creation event
          // because it may be for other updates
          <CommentRow
            key={`notification-pr-body-${pullRequest.id}`}
            avatarUrl={pullRequest.user.avatar_url}
            body={pullRequest.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={pullRequest.html_url}
            userLinkURL={pullRequest.user.html_url || ''}
            username={pullRequest.user.login}
          />
        )}

      {!!release && (
        <ReleaseRow
          key={`notification-release-row-${repo.id}`}
          avatarUrl={release.author.avatar_url}
          body={release.body}
          isRead={isRead}
          name={release.name || ''}
          ownerName={repoOwnerName || ''}
          repositoryName={repoName || ''}
          smallLeftColumn={smallLeftColumn}
          tagName={release.tag_name || ''}
          url={release.url}
          userLinkURL={release.author.html_url || ''}
          username={release.author.login || ''}
        />
      )}

      {!(commit || issue || pullRequest || release) && !!title && (
        <CommentRow
          key={`notification-${id}-comment-row`}
          avatarUrl=""
          body={title}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          userLinkURL=""
          username=""
          url={
            isRepoInvitation && repoOwnerName && repoName
              ? getGitHubURLForRepoInvitation(repoOwnerName, repoName)
              : isVulnerabilityAlert && repoOwnerName && repoName
              ? getGitHubURLForSecurityAlert(repoOwnerName, repoName)
              : fixURL(subject.latest_comment_url || subject.url)
          }
        />
      )}

      {!!comment && (
        <CommentRow
          key={`notification-comment-row-${comment.id}`}
          addBottomAnchor
          avatarUrl={comment.user.avatar_url}
          body={comment.body}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          url={comment.html_url}
          userLinkURL={comment.user.html_url || ''}
          username={comment.user.login}
        />
      )}

      {!!isPrivateAndCantSee && (
        <PrivateNotificationRow
          key={`private-notification-row-${notification.id}`}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          ownerId={
            (notification.repository.owner &&
              notification.repository.owner.id) ||
            undefined
          }
          repoId={repo.id}
        />
      )}
    </SpringAnimatedView>
  )
})
