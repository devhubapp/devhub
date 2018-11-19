import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import {
  GitHubNotification,
  GitHubNotificationReason,
} from 'shared-core/dist/types'
import { getOwnerAndRepo } from 'shared-core/dist/utils/helpers/github/shared'
import {
  getGitHubURLForRepoInvitation,
  getIssueOrPullRequestNumberFromUrl,
} from 'shared-core/dist/utils/helpers/github/url'
import {
  isNotificationPrivate,
  trimNewLinesAndSpaces,
} from 'shared-core/dist/utils/helpers/shared'
import { contentPadding } from '../../styles/variables'
import { getNotificationReasonMetadata } from '../../utils/helpers/github/notifications'
import {
  getIssueIconAndColor,
  getNotificationIconAndColor,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { ThemeConsumer } from '../context/ThemeContext'
import { NotificationCardHeader } from './partials/NotificationCardHeader'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitRow } from './partials/rows/CommitRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'

export interface NotificationCardProps {
  archived?: boolean
  notification: GitHubNotification
  onlyOneRepository?: boolean
  repoIsKnown?: boolean
}

export interface NotificationCardState {}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: contentPadding,
    paddingVertical: 1.5 * contentPadding,
  } as ViewStyle,
})

export class NotificationCard extends PureComponent<NotificationCardProps> {
  render() {
    const { archived, notification, onlyOneRepository } = this.props
    if (!notification || archived) return null

    const {
      // comment,
      repository: repo,
      subject,
      // updated_at: updatedAt,
      unread,
    } = notification

    if (!subject) return null

    const isRead = !unread // TODO
    const isPrivate = isNotificationPrivate(notification)
    const title = trimNewLinesAndSpaces(subject.title)

    const repoFullName =
      notification.repository.full_name || notification.repository.name || ''
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const cardIconDetails = getNotificationIconAndColor(
      notification,
      // subject, // TODO: Load commit/issue/pullrequest details
    )
    const cardIconName = cardIconDetails.icon
    const cardIconColor = cardIconDetails.color

    const labelDetails = getNotificationReasonMetadata(
      notification.reason as GitHubNotificationReason,
    )
    const labelText = labelDetails.label.toLowerCase()
    const labelColor = labelDetails.color

    // const notificationIds = [notification.id]

    // TODO: Load commit/issue/pullrequest details
    const subjectType = subject.type || ''
    const commit = (subjectType === 'Commit' && subject) || null
    const issue = (subjectType === 'Issue' && subject) || null
    const pullRequest = (subjectType === 'PullRequest' && subject) || null
    const release = (subjectType === 'Release' && subject) || null
    const isRepoInvitation = subjectType === 'RepositoryInvitation'

    const {
      icon: pullRequestIconName,
      color: pullRequestIconColor,
    } = pullRequest
      ? getPullRequestIconAndColor({}) // TODO: Load pull request details
      : { icon: undefined, color: undefined }

    const { icon: issueIconName, color: issueIconColor } = issue
      ? getIssueIconAndColor({}) // TODO: Load issue details
      : { icon: undefined, color: undefined }

    const issueOrPullRequestNumber =
      issue || pullRequest
        ? getIssueOrPullRequestNumberFromUrl((issue || pullRequest)!.url)
        : undefined

    return (
      <ThemeConsumer>
        {({ theme }) => (
          <View
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <NotificationCardHeader
              key={`notification-card-header-${notification.id}`}
              cardIconColor={cardIconColor || theme.foregroundColor}
              cardIconName={cardIconName}
              isPrivate={isPrivate}
              isRead={isRead}
              labelColor={labelColor}
              labelText={labelText}
              smallLeftColumn
              updatedAt={notification.updated_at}
            />

            {!!(repoOwnerName && repoName && !onlyOneRepository) && (
              <RepositoryRow
                key={`notification-repo-row-${repo.id}`}
                isRead={isRead}
                ownerName={repoOwnerName}
                repositoryName={repoName}
                smallLeftColumn
              />
            )}

            {Boolean(commit) && (
              <CommitRow
                key={`notification-commit-row-${commit!.url}`}
                isRead={isRead}
                latestCommentUrl={commit!.latest_comment_url}
                message={commit!.title}
                smallLeftColumn
                url={commit!.url}
              />
            )}

            {!!issue && (
              <IssueOrPullRequestRow
                key={`notification-issue-row-${issueOrPullRequestNumber}`}
                addBottomAnchor
                avatarURL=""
                iconColor={issueIconColor!}
                iconName={issueIconName!}
                isRead={isRead}
                issueOrPullRequestNumber={issueOrPullRequestNumber!}
                smallLeftColumn
                title={issue.title}
                url={issue.latest_comment_url || issue.url}
                userLinkURL=""
                username=""
              />
            )}

            {!!pullRequest && (
              <IssueOrPullRequestRow
                key={`notification-pr-row-${issueOrPullRequestNumber}`}
                addBottomAnchor
                avatarURL=""
                iconColor={pullRequestIconColor!}
                iconName={pullRequestIconName!}
                isRead={isRead}
                issueOrPullRequestNumber={issueOrPullRequestNumber!}
                smallLeftColumn
                title={pullRequest.title}
                url={pullRequest.latest_comment_url || pullRequest.url}
                userLinkURL=""
                username=""
              />
            )}

            {!!release && (
              <ReleaseRow
                key={`notification-release-row-${repo.id}`}
                avatarURL=""
                body={release.title}
                isRead={isRead}
                name={release.title}
                ownerName={repoOwnerName!}
                repositoryName={repoName!}
                smallLeftColumn
                tagName={release.title}
                type="ReleaseEvent"
                url={release.latest_comment_url || release.url}
                userLinkURL=""
                username=""
              />
            )}

            {!(commit || issue || pullRequest) && !!title && (
              <CommentRow
                key={`notification-${notification.id}-comment-row`}
                addBottomAnchor
                avatarURL=""
                body={title}
                isRead={isRead}
                smallLeftColumn
                userLinkURL=""
                username=""
                url={
                  isRepoInvitation && repo && repo.full_name
                    ? getGitHubURLForRepoInvitation(repo.full_name)
                    : undefined
                }
              />
            )}

            {/* {!!comment && (
              <CommentRow
                key={`notification-comment-row-${comment.id}`}
                addBottomAnchor
                body={comment.body}
                smallLeftColumn
                url={comment.html_url}
                userLinkURL={comment.user.html_url}
                username={comment.user.display_login || comment.user.login}
              />
            )} */}
          </View>
        )}
      </ThemeConsumer>
    )
  }
}
