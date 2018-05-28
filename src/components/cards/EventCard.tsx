import React, { PureComponent } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import theme from '../../styles/themes/dark'
import { contentPadding } from '../../styles/variables'
import {
  IForkEvent,
  IGitHubCommit,
  IGitHubCommitCommentEvent,
  IGitHubEvent,
  IGitHubPage,
  IGitHubRepo,
  IGitHubUser,
  IGollumEvent,
  IIssuesEvent,
  IMemberEvent,
  IPullRequestEvent,
  IPushEvent,
  IReleaseEvent,
} from '../../types'
import {
  getEventIconAndColor,
  getEventText,
} from '../../utils/helpers/github/events'
import {
  getIssueIconAndColor,
  getOwnerAndRepo,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { getRepoFullNameFromObject } from '../../utils/helpers/github/url'
import EventCardHeader from './partials/EventCardHeader'
import BranchRow from './partials/rows/BranchRow'
import CommentRow from './partials/rows/CommentRow'
import CommitListRow from './partials/rows/CommitListRow'
import IssueOrPullRequestRow from './partials/rows/IssueOrPullRequestRow'
import ReleaseRow from './partials/rows/ReleaseRow'
import RepositoryListRow from './partials/rows/RepositoryListRow'
import RepositoryRow from './partials/rows/RepositoryRow'
import UserListRow from './partials/rows/UserListRow'
import WikiPageListRow from './partials/rows/WikiPageListRow'

export interface EventCardProps {
  event: IGitHubEvent
}

export interface EventCardState {}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.cardBackground,
    paddingHorizontal: contentPadding,
    paddingVertical: 1.5 * contentPadding,
  } as ViewStyle,
})

export default class EventCard extends PureComponent<EventCardProps> {
  render() {
    const { event } = this.props
    if (!event) return null

    const { actor, payload, repo: _repo, type } = event

    const { comment } = payload as IGitHubCommitCommentEvent['payload']
    const { commits: _commits } = payload as IPushEvent['payload']
    const { forkee } = payload as IForkEvent['payload']
    const { member: _member } = payload as IMemberEvent['payload']
    const { release } = payload as IReleaseEvent['payload']
    const { pages: _pages } = payload as IGollumEvent['payload']
    const {
      pull_request: pullRequest,
    } = payload as IPullRequestEvent['payload']
    const { issue } = payload as IIssuesEvent['payload']
    const { ref: branchName } = payload as IPushEvent['payload']

    const isRead = false // TODO
    const commits: IGitHubCommit[] = (_commits || []).filter(Boolean)
    const repos: IGitHubRepo[] = [_repo].filter(Boolean) // TODO
    const users: IGitHubUser[] = [_member].filter(Boolean) // TODO
    const pages: IGitHubPage[] = (_pages || []).filter(Boolean)

    const repo = repos.length === 1 ? repos[0] : undefined

    const commitIds = commits
      .filter(Boolean)
      .map((item: IGitHubCommit) => item.sha)
    const pageIds = pages.filter(Boolean).map((item: IGitHubPage) => item.sha)
    const repoIds = repos.filter(Boolean).map((item: IGitHubRepo) => item.id)
    const userIds = users.filter(Boolean).map((item: IGitHubUser) => item.id)

    const repoFullName = repo && getRepoFullNameFromObject(repo)
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName || '',
    )

    const forkRepoFullName = getRepoFullNameFromObject(forkee)
    const { owner: forkRepoOwnerName, repo: forkRepoName } = getOwnerAndRepo(
      forkRepoFullName,
    )

    const cardIconDetails = getEventIconAndColor(event, theme)
    const cardIconName = cardIconDetails.subIcon || cardIconDetails.icon
    const cardIconColor = cardIconDetails.color || theme.base04

    const actionText = getEventText(event)

    const isPush = type === 'PushEvent'
    const isForcePush = isPush && (payload as IPushEvent).forced
    const isPrivate = !!(event.public === false || (repo && repo.private))

    const {
      icon: pullRequestIconName,
      color: pullRequestIconColor,
    } = pullRequest
      ? getPullRequestIconAndColor(pullRequest)
      : { icon: undefined, color: undefined }

    const pullRequestURL =
      pullRequest &&
      (comment && !comment.body && comment.html_url
        ? comment.html_url || comment.url
        : pullRequest.html_url || pullRequest.url)

    const { icon: issueIconName, color: issueIconColor } = issue
      ? getIssueIconAndColor(issue)
      : { icon: undefined, color: undefined }

    const issueURL =
      issue &&
      (comment && !comment.body && (comment.html_url || comment.url)
        ? comment.html_url || comment.url
        : issue.html_url || issue.url)

    return (
      <View style={styles.container}>
        <EventCardHeader
          key={`event-card-header-${event.id}`}
          actionText={actionText}
          avatarURL={actor.avatar_url}
          cardIconColor={cardIconColor}
          cardIconName={cardIconName}
          createdAt={event.created_at}
          isBot={Boolean(actor.login && actor.login.indexOf('[bot]') >= 0)}
          isPrivate={isPrivate}
          userLinkURL={actor.html_url || ''}
          username={actor.display_login || actor.login}
        />

        {repos.length > 0 && (
          <RepositoryListRow
            key={`repo-list-row-${repoIds.join('-')}`}
            isForcePush={isForcePush}
            isPush={isPush}
            isRead={isRead}
            repos={repos}
            theme={theme}
          />
        )}

        {Boolean(repo && repoOwnerName && repoName && branchName) && (
          <BranchRow
            key={`branch-row-${branchName}`}
            branch={branchName}
            isRead={isRead}
            ownerName={repoOwnerName!}
            repositoryName={repoName!}
            type={type}
          />
        )}

        {Boolean(forkee && forkRepoOwnerName && forkRepoName) && (
          <RepositoryRow
            key={`fork-row-${forkee.id}`}
            isForcePush={isForcePush}
            isFork
            isRead={isRead}
            ownerName={forkRepoOwnerName!}
            repositoryName={forkRepoName!}
          />
        )}

        {users.length > 0 && (
          <UserListRow
            key={`user-list-row-${userIds.join('-')}`}
            isRead={isRead}
            users={users}
            theme={theme}
          />
        )}

        {pages.length > 0 && (
          <WikiPageListRow
            key={`wiki-page-list-row-${pageIds.join('-')}`}
            isRead={isRead}
            pages={pages}
            theme={theme}
          />
        )}

        {Boolean(pullRequest) && (
          <IssueOrPullRequestRow
            key={`pr-row-${pullRequest.id}`}
            avatarURL={pullRequest.user.avatar_url}
            iconColor={pullRequestIconColor!}
            iconName={pullRequestIconName!}
            isRead={isRead}
            issueNumber={pullRequest.number}
            theme={theme}
            title={pullRequest.title}
            url={pullRequestURL}
            userLinkURL={pullRequest.user.html_url || ''}
            username={pullRequest.user.display_login || pullRequest.user.login}
          />
        )}

        {commits.length > 0 && (
          <CommitListRow
            key={`commit-list-row-${commitIds.join('-')}`}
            commits={commits}
            isRead={isRead}
            theme={theme}
          />
        )}

        {Boolean(issue) && (
          <IssueOrPullRequestRow
            key={`issue-row-${issue.id}`}
            avatarURL={issue.user.avatar_url}
            iconColor={issueIconColor!}
            iconName={issueIconName!}
            isRead={isRead}
            issueNumber={issue.number}
            theme={theme}
            title={issue.title}
            url={issueURL}
            userLinkURL={issue.user.html_url || ''}
            username={issue.user.display_login || issue.user.login}
          />
        )}

        {(type === 'IssuesEvent' &&
          (payload as IIssuesEvent['payload']).action === 'opened' &&
          Boolean(issue.body) && (
            <CommentRow
              key={`issue-body-row-${issue.id}`}
              avatarURL={issue.user.avatar_url}
              body={issue.body}
              isRead={isRead}
              url={issue.html_url || issue.url}
              userLinkURL={issue.user.html_url || ''}
              username={issue.user.display_login || issue.user.login}
            />
          )) ||
          (type === 'PullRequestEvent' &&
            (payload as IPullRequestEvent['payload']).action === 'opened' &&
            Boolean(pullRequest.body) && (
              <CommentRow
                key={`pr-body-row-${pullRequest.id}`}
                avatarURL={pullRequest.user.avatar_url}
                body={pullRequest.body}
                isRead={isRead}
                url={pullRequest.html_url || pullRequest.url}
                userLinkURL={pullRequest.user.html_url || ''}
                username={
                  pullRequest.user.display_login || pullRequest.user.login
                }
              />
            )) ||
          (Boolean(comment && comment.body) && (
            <CommentRow
              key={`comment-row-${comment.id}`}
              avatarURL={comment.user.avatar_url}
              body={comment.body}
              isRead={isRead}
              url={comment.html_url || comment.url}
              userLinkURL={comment.user.html_url || ''}
              username={comment.user.display_login || comment.user.login}
            />
          ))}

        {Boolean(release) && (
          <ReleaseRow
            key={`release-row-${release.id}`}
            avatarURL={release.author.avatar_url}
            body={release.body}
            branch={release.target_commitish}
            isRead={isRead}
            name={release.name}
            ownerName={repoOwnerName!}
            repositoryName={repoName!}
            tagName={release.tag_name}
            type={type}
            url={release.html_url || release.url}
            userLinkURL={release.author.html_url || ''}
            username={release.author.display_login || release.author.login}
          />
        )}
      </View>
    )
  }
}
