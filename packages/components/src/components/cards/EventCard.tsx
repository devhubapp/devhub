import React, { useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  CardViewMode,
  EnhancedGitHubEvent,
  getEventText,
  getGitHubAvatarURLFromPayload,
  getIssueOrPullRequestNumberFromUrl,
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
  isItemRead,
  MultipleStarEvent,
  Theme,
} from '@devhub/core'
import { useCSSVariablesOrSpringAnimatedTheme } from '../../hooks/use-css-variables-or-spring--animated-theme'
import { Platform } from '../../libs/platform'
import { contentPadding } from '../../styles/variables'
import { getReadableColor } from '../../utils/helpers/colors'
import { getEventIconAndColor } from '../../utils/helpers/github/events'
import { tryFocus } from '../../utils/helpers/shared'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'
import { getColumnCardThemeColors } from '../columns/EventOrNotificationColumn'
import { useTheme } from '../context/ThemeContext'
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
  cardViewMode: CardViewMode
  event: EnhancedGitHubEvent
  isFocused?: boolean
  repoIsKnown?: boolean
}

const styles = StyleSheet.create({
  container: {
    padding: contentPadding,
  },
})

export const EventCard = React.memo((props: EventCardProps) => {
  const { cardViewMode, event, repoIsKnown, isFocused } = props

  const itemRef = useRef<View>(null)
  const springAnimatedTheme = useCSSVariablesOrSpringAnimatedTheme()

  const themeRef = useRef<Theme | null>(null)
  const initialTheme = useTheme(theme => {
    themeRef.current = theme
  })
  themeRef.current = initialTheme

  useEffect(() => {
    if (Platform.OS === 'web' && isFocused && itemRef.current) {
      tryFocus(itemRef.current)
    }
  }, [isFocused])

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

  const issueOrPullRequest = issue || pullRequest

  const issueOrPullRequestNumber = issueOrPullRequest
    ? issueOrPullRequest.number ||
      getIssueOrPullRequestNumberFromUrl(issueOrPullRequest!.url)
    : undefined

  const isRead = isItemRead(event)
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
  const _cardIconColor = cardIconDetails.color

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

  const avatarUrl = (isBot && botAvatarURL) || actor.avatar_url

  // const {
  //   icon: pullRequestIconName,
  //   color: _pullRequestIconColor,
  // } = pullRequest
  //   ? getPullRequestIconAndColor(pullRequest)
  //   : { icon: undefined, color: undefined }

  // const pullRequestURL =
  //   pullRequest &&
  //   (comment && !comment.body && comment.html_url
  //     ? comment.html_url || comment.url
  //     : pullRequest.html_url || pullRequest.url)

  // const { icon: issueIconName, color: _issueIconColor } = issue
  //   ? getIssueIconAndColor(issue)
  //   : { icon: undefined, color: undefined }

  const backgroundThemeColors = getColumnCardThemeColors(
    themeRef.current.backgroundColor,
  )
  const backgroundThemeColor =
    // (isFocused && 'backgroundColorLess2') ||
    (isRead && backgroundThemeColors.read) || backgroundThemeColors.unread

  const cardIconColor =
    _cardIconColor &&
    getReadableColor(
      _cardIconColor,
      themeRef.current![backgroundThemeColor],
      0.3,
    )

  // const issueIconColor =
  //   _issueIconColor &&
  //   getReadableColor(
  //     _issueIconColor,
  //     themeRef.current![backgroundThemeColor],
  //     0.3,
  //   )

  // const pullRequestIconColor =
  //   _pullRequestIconColor &&
  //   getReadableColor(
  //     _pullRequestIconColor,
  //     themeRef.current![backgroundThemeColor],
  //     0.3,
  //   )

  return (
    <SpringAnimatedView
      key={`event-card-${id}-inner`}
      ref={itemRef}
      style={[
        styles.container,
        {
          backgroundColor: springAnimatedTheme[backgroundThemeColor],
          borderWidth: 1,
          borderColor:
            isFocused && cardViewMode !== 'compact'
              ? springAnimatedTheme.primaryBackgroundColor
              : 'transparent',
        },
      ]}
    >
      {!!isFocused && cardViewMode === 'compact' && (
        <SpringAnimatedView
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: 2,
            backgroundColor: springAnimatedTheme.primaryBackgroundColor,
          }}
        />
      )}

      <EventCardHeader
        key={`event-card-header-${id}`}
        actionText={actionText}
        avatarUrl={avatarUrl}
        backgroundThemeColor={backgroundThemeColor}
        cardIconColor={cardIconColor}
        cardIconName={cardIconName}
        date={event.created_at}
        ids={('merged' in event && event.merged) || [id]}
        isBot={isBot}
        isPrivate={isPrivate}
        isRead={isRead}
        isSaved={isSaved}
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
          small
          viewMode={cardViewMode}
          withTopMargin
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
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {Boolean(forkee && forkRepoOwnerName && forkRepoName) && (
        <RepositoryRow
          key={`event-fork-row-${forkee.id}`}
          isForcePush={isForcePush}
          isFork
          isRead={isRead}
          ownerName={forkRepoOwnerName || ''}
          repositoryName={forkRepoName || ''}
          small
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {!!issueOrPullRequest && (
        <IssueOrPullRequestRow
          key={`event-issue-or-pr-row-${issueOrPullRequest.id}`}
          addBottomAnchor={!comment}
          avatarUrl={issueOrPullRequest.user.avatar_url}
          body={
            !comment &&
            !!(
              issueOrPullRequest &&
              issueOrPullRequest.state === 'open' &&
              issueOrPullRequest.body &&
              !(
                issueOrPullRequest.created_at &&
                issueOrPullRequest.updated_at &&
                new Date(issueOrPullRequest.updated_at).valueOf() -
                  new Date(issueOrPullRequest.created_at).valueOf() >=
                  1000 * 60 * 60 * 24
              )
            )
              ? issueOrPullRequest.body
              : undefined
          }
          bold
          commentsCount={issueOrPullRequest.comments}
          createdAt={issueOrPullRequest.created_at}
          hideIcon
          // iconColor={issueIconColor || pullRequestIconColor}
          // iconName={issueIconName! || pullRequestIconName}
          id={issueOrPullRequest.id}
          isPrivate={isPrivate}
          isRead={isRead}
          issueOrPullRequestNumber={issueOrPullRequestNumber!}
          labels={issueOrPullRequest.labels}
          owner={repoOwnerName || ''}
          repo={repoName || ''}
          title={issueOrPullRequest.title}
          url={issueOrPullRequest.url}
          userLinkURL={issueOrPullRequest.user.html_url || ''}
          username={issueOrPullRequest.user.login || ''}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {users.length > 0 && (
        <UserListRow
          isRead={isRead}
          key={`event-user-list-row-${userIds.join('-')}`}
          users={users}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {pages.length > 0 && (
        <WikiPageListRow
          // bold
          // hideIcon={pages.length === 1}
          isRead={isRead}
          key={`event-wiki-page-list-row-${pageIds.join('-')}`}
          pages={pages}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {commits.length > 0 && (
        <CommitListRow
          key={`event-commit-list-row-${commitIds.join('-')}`}
          // bold
          commits={commits}
          // hideIcon={commits.length === 1}
          isPrivate={isPrivate}
          isRead={isRead}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {Boolean(comment && comment.body) && (
        <CommentRow
          key={`event-comment-row-${comment.id}`}
          avatarUrl={comment.user.avatar_url}
          body={comment.body}
          isRead={isRead}
          url={comment.html_url || comment.url}
          userLinkURL={comment.user.html_url || ''}
          username={comment.user.display_login || comment.user.login}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}

      {Boolean(release) && (
        <ReleaseRow
          key={`event-release-row-${release.id}`}
          avatarUrl={release.author.avatar_url}
          body={release.body}
          bold
          branch={release.target_commitish}
          hideIcon
          isPrivate={isPrivate}
          isRead={isRead}
          name={release.name}
          ownerName={repoOwnerName || ''}
          repositoryName={repoName || ''}
          tagName={release.tag_name}
          url={release.html_url || release.url}
          userLinkURL={release.author.html_url || ''}
          username={release.author.display_login || release.author.login}
          viewMode={cardViewMode}
          withTopMargin
        />
      )}
    </SpringAnimatedView>
  )
})
