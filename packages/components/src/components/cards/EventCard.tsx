import React from 'react'
import { StyleSheet, View } from 'react-native'

import {
  EnhancedGitHubEvent,
  getEventText,
  getGitHubAvatarURLFromPayload,
  getOwnerAndRepo,
  getRepoFullNameFromObject,
  GitHubCommitCommentEvent,
  GitHubCreateEvent,
  GitHubEvent,
  GitHubForkEvent,
  GitHubGollumEvent,
  GitHubIssuesEvent,
  GitHubMemberEvent,
  GitHubPage,
  GitHubPullRequestEvent,
  GitHubPushedCommit,
  GitHubPushEvent,
  GitHubReleaseEvent,
  GitHubRepo,
  GitHubUser,
  isEventPrivate,
  MultipleStarEvent,
} from '@devhub/core'
import { contentPadding } from '../../styles/variables'
import { getEventIconAndColor } from '../../utils/helpers/github/events'
import {
  getIssueIconAndColor,
  getPullRequestIconAndColor,
} from '../../utils/helpers/github/shared'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { useSpringAnimatedTheme } from '../context/SpringAnimatedThemeContext'
import { EventCardHeader } from './partials/EventCardHeader'
import { BranchRow } from './partials/rows/BranchRow'
import { CommentRow } from './partials/rows/CommentRow'
import { CommitListRow } from './partials/rows/CommitListRow'
import { IssueOrPullRequestRow } from './partials/rows/IssueOrPullRequestRow'
import { ReleaseRow } from './partials/rows/ReleaseRow'
import { RepositoryListRow } from './partials/rows/RepositoryListRow'
import { RepositoryRow } from './partials/rows/RepositoryRow'
import { UserListRow } from './partials/rows/UserListRow'
import { WikiPageListRow } from './partials/rows/WikiPageListRow'

export interface EventCardProps {
  event: EnhancedGitHubEvent
  repoIsKnown?: boolean
}

const styles = StyleSheet.create({
  container: {
    padding: contentPadding,
  },
})

export const EventCard = React.memo((props: EventCardProps) => {
  const { event, repoIsKnown } = props

  const springAnimatedTheme = useSpringAnimatedTheme()

  if (!event) return null

  const { actor, payload, id, saved, type } = event as EnhancedGitHubEvent
  const { repo: _repo } = event as GitHubEvent
  const { repos: _repos } = event as MultipleStarEvent

  const { comment } = payload as GitHubCommitCommentEvent['payload']
  const { commits: _commits } = payload as GitHubPushEvent['payload']
  const { forkee } = payload as GitHubForkEvent['payload']
  const { member: _member } = payload as GitHubMemberEvent['payload']
  let { release } = payload as GitHubReleaseEvent['payload']
  const { pages: _pages } = payload as GitHubGollumEvent['payload']
  const {
    pull_request: pullRequest,
  } = payload as GitHubPullRequestEvent['payload']
  const { issue } = payload as GitHubIssuesEvent['payload']
  let { ref: branchName } = payload as GitHubPushEvent['payload']

  const isRead = false
  const isSaved = saved === true

  const commits: GitHubPushedCommit[] = (_commits || []).filter(Boolean)
  const _allRepos: GitHubRepo[] = (_repos || [_repo]).filter(Boolean)
  const repos: GitHubRepo[] = _allRepos.filter(
    (r, index) => !!(r && !(repoIsKnown && index === 0)),
  )
  const users: GitHubUser[] = [_member].filter(Boolean) // TODO
  const pages: GitHubPage[] = (_pages || []).filter(Boolean)

  const repo = _allRepos.length === 1 ? _allRepos[0] : undefined

  if (event.type === 'CreateEvent' || event.type === 'DeleteEvent') {
    const p = payload as GitHubCreateEvent['payload']

    if (p.ref_type !== 'branch') branchName = ''

    if (!release && p.ref_type === 'tag') {
      release = {
        id: '',
        name: '',
        tag_name: p.ref || '',
        target_commitish: p.master_branch,
        body: '',
        draft: false,
        prerelease: false,
        created_at: event.created_at,
        published_at: event.created_at,
        author: event.actor,
        assets: [],
        url: '',
        html_url: '',
      }
    }
  }

  const commitIds = commits
    .filter(Boolean)
    .map((item: GitHubPushedCommit) => item.sha)
  const pageIds = pages.filter(Boolean).map((item: GitHubPage) => item.sha)
  const repoIds = repos.filter(Boolean).map((item: GitHubRepo) => item.id)
  const userIds = users.filter(Boolean).map((item: GitHubUser) => item.id)

  const repoFullName = repo && getRepoFullNameFromObject(repo)
  const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
    repoFullName || '',
  )

  const forkRepoFullName = getRepoFullNameFromObject(forkee)
  const { owner: forkRepoOwnerName, repo: forkRepoName } = getOwnerAndRepo(
    forkRepoFullName,
  )

  const cardIconDetails = getEventIconAndColor(event)
  const cardIconName = cardIconDetails.subIcon || cardIconDetails.icon
  const cardIconColor = cardIconDetails.color

  const actionText = getEventText(event, { repoIsKnown })

  const isPush = type === 'PushEvent'
  const isForcePush = isPush && (payload as GitHubPushEvent).forced
  const isPrivate = isEventPrivate(event)

  const isBot = Boolean(actor.login && actor.login.indexOf('[bot]') >= 0)

  // GitHub returns the wrong avatar_url for app bots on actor.avatar_url,
  // but the correct avatar on payload.abc.user.avatar_url,
  // so lets get it from there instead
  const botAvatarURL = isBot
    ? getGitHubAvatarURLFromPayload(payload, actor.id)
    : undefined

  const avatarURL = (isBot && botAvatarURL) || actor.avatar_url

  const { icon: pullRequestIconName, color: pullRequestIconColor } = pullRequest
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

  const smallLeftColumn = false

  return (
    <SpringAnimatedView
      key={`event-card-${id}-inner`}
      style={[
        styles.container,
        {
          backgroundColor: isRead
            ? springAnimatedTheme.backgroundColorDarker1
            : springAnimatedTheme.backgroundColor,
        },
      ]}
    >
      <EventCardHeader
        key={`event-card-header-${id}`}
        actionText={actionText}
        avatarURL={avatarURL}
        cardIconColor={cardIconColor}
        cardIconName={cardIconName}
        date={event.created_at}
        ids={('merged' in event && event.merged) || [id]}
        isBot={isBot}
        isPrivate={isPrivate}
        isSaved={isSaved}
        smallLeftColumn={smallLeftColumn}
        userLinkURL={actor.html_url || ''}
        username={actor.display_login || actor.login}
      />

      {repos.length > 0 && (
        <RepositoryListRow
          key={`event-repo-list-row-${repoIds.join('-')}`}
          isForcePush={isForcePush}
          isPush={isPush}
          isRead={isRead}
          repos={repos}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {Boolean(branchName) && (
        <BranchRow
          key={`event-branch-row-${branchName}`}
          branch={branchName}
          isBranchMainEvent={
            (type === 'CreateEvent' || type === 'DeleteEvent') &&
            (payload as GitHubCreateEvent['payload']).ref_type === 'branch'
          }
          isRead={isRead}
          ownerName={repoOwnerName || ''}
          repositoryName={repoName || ''}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {Boolean(forkee && forkRepoOwnerName && forkRepoName) && (
        <RepositoryRow
          key={`event-fork-row-${forkee.id}`}
          isForcePush={isForcePush}
          isFork
          isRead={isRead}
          ownerName={forkRepoOwnerName!}
          repositoryName={forkRepoName!}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {users.length > 0 && (
        <UserListRow
          key={`event-user-list-row-${userIds.join('-')}`}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
          users={users}
        />
      )}

      {pages.length > 0 && (
        <WikiPageListRow
          key={`event-wiki-page-list-row-${pageIds.join('-')}`}
          isRead={isRead}
          pages={pages}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {Boolean(pullRequest) && (
        <IssueOrPullRequestRow
          key={`event-pr-row-${pullRequest.id}`}
          avatarURL={pullRequest.user.avatar_url}
          commentsCount={pullRequest.comments}
          createdAt={pullRequest.created_at}
          iconColor={pullRequestIconColor!}
          iconName={pullRequestIconName!}
          isRead={isRead}
          issueOrPullRequestNumber={pullRequest.number}
          smallLeftColumn={smallLeftColumn}
          title={pullRequest.title}
          url={pullRequestURL}
          userLinkURL={pullRequest.user.html_url || ''}
          username={pullRequest.user.display_login || pullRequest.user.login}
        />
      )}

      {commits.length > 0 && (
        <CommitListRow
          key={`event-commit-list-row-${commitIds.join('-')}`}
          commits={commits}
          isRead={isRead}
          smallLeftColumn={smallLeftColumn}
        />
      )}

      {Boolean(issue) && (
        <IssueOrPullRequestRow
          key={`event-issue-row-${issue.id}`}
          avatarURL={issue.user.avatar_url}
          commentsCount={issue.comments}
          createdAt={issue.created_at}
          iconColor={issueIconColor!}
          iconName={issueIconName!}
          isRead={isRead}
          issueOrPullRequestNumber={issue.number}
          smallLeftColumn={smallLeftColumn}
          title={issue.title}
          url={issueURL}
          userLinkURL={issue.user.html_url || ''}
          username={issue.user.display_login || issue.user.login}
        />
      )}

      {(type === 'IssuesEvent' &&
        (payload as GitHubIssuesEvent['payload']).action === 'opened' &&
        Boolean(issue.body) && (
          <CommentRow
            key={`event-issue-body-row-${issue.id}`}
            avatarURL={issue.user.avatar_url}
            body={issue.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={issue.html_url || issue.url}
            userLinkURL={issue.user.html_url || ''}
            username={issue.user.display_login || issue.user.login}
          />
        )) ||
        (type === 'PullRequestEvent' &&
          (payload as GitHubPullRequestEvent['payload']).action === 'opened' &&
          Boolean(pullRequest.body) && (
            <CommentRow
              key={`event-pr-body-row-${pullRequest.id}`}
              avatarURL={pullRequest.user.avatar_url}
              body={pullRequest.body}
              isRead={isRead}
              smallLeftColumn={smallLeftColumn}
              url={pullRequest.html_url || pullRequest.url}
              userLinkURL={pullRequest.user.html_url || ''}
              username={
                pullRequest.user.display_login || pullRequest.user.login
              }
            />
          )) ||
        (Boolean(comment && comment.body) && (
          <CommentRow
            key={`event-comment-row-${comment.id}`}
            avatarURL={comment.user.avatar_url}
            body={comment.body}
            isRead={isRead}
            smallLeftColumn={smallLeftColumn}
            url={comment.html_url || comment.url}
            userLinkURL={comment.user.html_url || ''}
            username={comment.user.display_login || comment.user.login}
          />
        ))}

      {Boolean(release) && (
        <ReleaseRow
          key={`event-release-row-${release.id}`}
          avatarURL={release.author.avatar_url}
          body={release.body}
          branch={release.target_commitish}
          isRead={isRead}
          name={release.name}
          ownerName={repoOwnerName!}
          repositoryName={repoName!}
          smallLeftColumn={smallLeftColumn}
          tagName={release.tag_name}
          url={release.html_url || release.url}
          userLinkURL={release.author.html_url || ''}
          username={release.author.display_login || release.author.login}
        />
      )}
    </SpringAnimatedView>
  )
})
