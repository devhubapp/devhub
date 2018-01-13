import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import { IGitHubNotification } from '../../types/index'
import { getNotificationReasonTextsAndColor } from '../../utils/helpers/github/notifications'
import {
  getIssueIconAndColor,
  getNotificationIconAndColor,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { getIssueOrPullRequestNumberFromUrl } from '../../utils/helpers/github/url'
import { trimNewLinesAndSpaces } from '../../utils/helpers/shared'
import NotificationCardHeader from './partials/NotificationCardHeader'
import CommentRow from './partials/rows/CommentRow'
import CommitRow from './partials/rows/CommitRow'
import IssueOrPullRequestRow from './partials/rows/IssueOrPullRequestRow'
import ReleaseRow from './partials/rows/ReleaseRow'
import RepositoryRow from './partials/rows/RepositoryRow'

export interface IProps {
  archived?: boolean
  notification: IGitHubNotification
  onlyOneRepository?: boolean
}

export interface IState {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: contentPadding,
    paddingVertical: 1.5 * contentPadding,
  } as ViewStyle,
})

export default class NotificationCard extends PureComponent<IProps> {
  render() {
    const { archived, notification, onlyOneRepository } = this.props
    if (!notification || archived) return null

    const {
      // comment,
      repository: repo,
      subject,
      // updated_at: updatedAt,
    } = notification

    if (!subject) return null

    const isRead = true // TODO
    const isPrivate = Boolean(repo && repo.private)
    const title = trimNewLinesAndSpaces(subject.title)

    const repoFullName =
      notification.repository.full_name || notification.repository.name || ''
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    const cardIconDetails = getNotificationIconAndColor(
      notification,
      subject, // TODO: Load commit/issue/pullrequest details
      theme,
    )
    const cardIconName = cardIconDetails.icon
    const cardIconColor = cardIconDetails.color || theme.base04

    const labelDetails = getNotificationReasonTextsAndColor(notification)
    const labelText = labelDetails.label.toLowerCase()
    const labelColor = labelDetails.color

    // const notificationIds = [notification.id]

    // TODO: Load commit/issue/pullrequest details
    const subjectType = (subject.type || '').toLowerCase()
    const commit = (subjectType === 'commit' && subject) || null
    const issue = (subjectType === 'issue' && subject) || null
    const pullRequest = (subjectType === 'pullrequest' && subject) || null
    const release = (subjectType === 'release' && subject) || null

    const {
      icon: pullRequestIconName,
      color: pullRequestIconColor,
    } = pullRequest
      ? getPullRequestIconAndColor(pullRequest) // TODO: Load pull request details
      : { icon: undefined, color: undefined }

    const { icon: issueIconName, color: issueIconColor } = issue
      ? getIssueIconAndColor(issue) // TODO: Load issue details
      : { icon: undefined, color: undefined }

    const issueOrPullRequestNumber =
      issue || pullRequest
        ? getIssueOrPullRequestNumberFromUrl((issue || pullRequest)!.url)
        : undefined

    return (
      <View style={styles.container}>
        <NotificationCardHeader
          cardIconColor={cardIconColor}
          cardIconName={cardIconName}
          labelColor={labelColor}
          labelText={labelText}
          isRead={isRead}
          isPrivate={isPrivate}
          repoOwnerName={repoOwnerName!}
        />

        {!!(repoOwnerName && repoName && !onlyOneRepository) && (
          <RepositoryRow
            key={`repo-row-${repo.id}`}
            isRead={isRead}
            ownerName={repoOwnerName}
            repositoryName={repoName}
          />
        )}

        {Boolean(commit) && (
          <CommitRow
            key={`commit-row-${commit!.latest_comment_url}`}
            message={commit!.title}
            url={commit!.latest_comment_url || commit!.url}
          />
        )}

        {!!issue && (
          <IssueOrPullRequestRow
            key={`issue-row-${issueOrPullRequestNumber}`}
            iconColor={issueIconColor}
            iconName={issueIconName}
            issueNumber={issueOrPullRequestNumber!}
            theme={theme}
            title={issue.title}
            url={issue.latest_comment_url || issue.url}
          />
        )}

        {!!pullRequest && (
          <IssueOrPullRequestRow
            key={`pr-row-${issueOrPullRequestNumber}`}
            iconColor={pullRequestIconColor}
            iconName={pullRequestIconName}
            issueNumber={issueOrPullRequestNumber!}
            theme={theme}
            title={pullRequest.title}
            url={pullRequest.latest_comment_url || pullRequest.url}
          />
        )}

        {!!release && (
          <ReleaseRow
            key={`release-row-${repo.id}`}
            body={release.title}
            ownerName={repoOwnerName!}
            repositoryName={repoName!}
            url={release.latest_comment_url || release.url}
            type="ReleaseEvent"
            name={release.title}
            tagName={release.title}
          />
        )}

        {!(commit || issue || pullRequest) &&
          !!title && (
            <CommentRow
              key={`subject-row-${subject.url}`}
              body={title}
              isRead={isRead}
              username=""
            />
          )}

        {/* {!!comment && (
          <CommentRow
            key={`comment-row-${comment.id}`}
            body={comment.body}
            url={comment.html_url}
            username={comment.user.login}
          />
        )} */}
      </View>
    )
  }
}
