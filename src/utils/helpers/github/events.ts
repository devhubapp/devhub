import * as baseTheme from '../../../styles/themes/base'
import {
  getIssueIconAndColor,
  getPullRequestIconAndColor,
  isPullRequest,
} from './shared'

import {
  IBaseTheme,
  IGitHubEvent,
  IGitHubIcon,
  IGitHubIssue,
  IGitHubPullRequest,
  IPullRequestEvent,
} from '../../../types'

export function getEventIconAndColor(
  event: IGitHubEvent,
  theme: IBaseTheme | undefined = baseTheme,
): { color?: string; icon: IGitHubIcon; subIcon?: IGitHubIcon } {
  const eventType = event.type.split(':')[0]
  const payload = event.payload

  switch (eventType) {
    case 'CommitCommentEvent':
      return { icon: 'git-commit', subIcon: 'comment-discussion' }
    case 'CreateEvent':
      switch (payload.ref_type) {
        case 'repository':
          return { icon: 'repo' }
        case 'branch':
          return { icon: 'git-branch' }
        case 'tag':
          return { icon: 'tag' }
        default:
          return { icon: 'plus' }
      }
    case 'DeleteEvent':
      switch (payload.ref_type) {
        case 'repository':
          return { icon: 'repo', color: theme.red }
        case 'branch':
          return { icon: 'git-branch', color: theme.red }
        case 'tag':
          return { icon: 'tag', color: theme.red }
        default:
          return { icon: 'trashcan' }
      }
    case 'GollumEvent':
      return { icon: 'book' }
    case 'ForkEvent':
      return { icon: 'repo-forked' }

    case 'IssueCommentEvent':
      return {
        ...payload.pull_request || isPullRequest(payload.issue)
          ? getPullRequestIconAndColor(
              payload.pull_request || payload.issue,
              theme,
            )
          : getIssueIconAndColor(payload.issue, theme),
        subIcon: 'comment-discussion',
      }

    case 'IssuesEvent': {
      const issue = payload.issue

      switch (payload.action) {
        case 'opened':
          return getIssueIconAndColor({ state: 'open' } as IGitHubIssue, theme)
        case 'closed':
          return getIssueIconAndColor(
            { state: 'closed' } as IGitHubIssue,
            theme,
          )

        case 'reopened':
          return {
            ...getIssueIconAndColor({ state: 'open' } as IGitHubIssue, theme),
            icon: 'issue-reopened',
          }
        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        // case 'milestoned':
        // case 'demilestoned':
        default:
          return getIssueIconAndColor(issue, theme)
      }
    }
    case 'MemberEvent':
      return { icon: 'person' }
    case 'PublicEvent':
      return { icon: 'globe', color: theme.blue }

    case 'PullRequestEvent':
      return (() => {
        const pullRequest = payload.pull_request

        switch (payload.action) {
          case 'opened':
          case 'reopened':
            return getPullRequestIconAndColor(
              { state: 'open' } as IGitHubPullRequest,
              theme,
            )
          // case 'closed': return getPullRequestIconAndColor({ state: 'closed' } as IGitHubPullRequest, theme);

          // case 'assigned':
          // case 'unassigned':
          // case 'labeled':
          // case 'unlabeled':
          // case 'edited':
          default:
            return getPullRequestIconAndColor(pullRequest, theme)
        }
      })()

    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent':
      return {
        ...getPullRequestIconAndColor(payload.pull_request, theme),
        subIcon: 'comment-discussion',
      }

    case 'PushEvent':
      return { icon: 'code' }
    case 'ReleaseEvent':
      return { icon: 'tag' }
    case 'WatchEvent':
      return { icon: 'star', color: theme.star }
    default:
      return { icon: 'mark-github' }
  }
}

export function getEventText(
  event: IGitHubEvent,
  options:
    | {
        issueOrPullRequestIsKnown?: boolean
        repoIsKnown?: boolean
      }
    | undefined = {},
): string {
  const { issueOrPullRequestIsKnown, repoIsKnown } = options

  const issueText = issueOrPullRequestIsKnown ? 'this issue' : 'an issue'
  const pullRequestText = issueOrPullRequestIsKnown ? 'this pr' : 'a pr'
  const repositoryText = repoIsKnown ? 'this repository' : 'a repository'

  const text = (() => {
    switch (event.type) {
      case 'CommitCommentEvent':
        return 'commented on a commit'
      case 'CreateEvent':
        switch (event.payload.ref_type) {
          case 'repository':
            return `created ${repositoryText}`
          case 'branch':
            return 'created a branch'
          case 'tag':
            return 'created a tag'
          default:
            return 'created something'
        }
      case 'DeleteEvent':
        switch (event.payload.ref_type) {
          case 'repository':
            return `deleted ${repositoryText}`
          case 'branch':
            return 'deleted a branch'
          case 'tag':
            return 'deleted a tag'
          default:
            return 'deleted something'
        }
      case 'GollumEvent':
        return (() => {
          const count = (event.payload.pages || []).length || 1
          const pagesText = count > 1 ? `${count} wiki pages` : 'a wiki page'
          switch (((event.payload.pages || [])[0] || {}).action) {
            case 'created':
              return `created ${pagesText}`
            default:
              return `updated ${pagesText}`
          }
        })()
      case 'ForkEvent':
        return `forked ${repositoryText}`
      case 'IssueCommentEvent':
        return `commented on ${
          isPullRequest(event.payload.issue) ? pullRequestText : issueText
        }`
      case 'IssuesEvent': // TODO: Fix these texts
        switch (event.payload.action) {
          case 'closed':
            return `closed ${issueText}`
          case 'reopened':
            return `reopened ${issueText}`
          case 'opened':
            return `opened ${issueText}`
          case 'assigned':
            return `assigned ${issueText}`
          case 'unassigned':
            return `unassigned ${issueText}`
          case 'labeled':
            return `labeled ${issueText}`
          case 'unlabeled':
            return `unlabeled ${issueText}`
          case 'edited':
            return `edited ${issueText}`
          case 'milestoned':
            return `milestoned ${issueText}`
          case 'demilestoned':
            return `demilestoned ${issueText}`
          default:
            return `interacted with ${issueText}`
        }
      case 'MemberEvent':
        return `added an user ${repositoryText && `to ${repositoryText}`}`
      case 'PublicEvent':
        return `made ${repositoryText} public`
      case 'PullRequestEvent':
        switch ((event as IPullRequestEvent).payload.action) {
          case 'assigned':
            return `assigned ${pullRequestText}`
          case 'unassigned':
            return `unassigned ${pullRequestText}`
          case 'labeled':
            return `labeled ${pullRequestText}`
          case 'unlabeled':
            return `unlabeled ${pullRequestText}`
          case 'opened':
            return `opened ${pullRequestText}`
          case 'edited':
            return `edited ${pullRequestText}`

          case 'closed':
            return event.payload.pull_request.merged_at
              ? `merged ${pullRequestText}`
              : `closed ${pullRequestText}`

          case 'reopened':
            return `reopened ${pullRequestText}`
          default:
            return `interacted with ${pullRequestText}`
        }
      case 'PullRequestReviewEvent':
        return `reviewed ${pullRequestText}`
      case 'PullRequestReviewCommentEvent':
        switch (event.payload.action) {
          case 'created':
            return `commented on ${pullRequestText} review`
          case 'edited':
            return `edited ${pullRequestText} review`
          case 'deleted':
            return `deleted ${pullRequestText} review`
          default:
            return `interacted with ${pullRequestText} review`
        }
      case 'PushEvent':
        return (() => {
          const commits = event.payload.commits || [{}]
          // const commit = payload.head_commit || commits[0];
          const count =
            Math.max(
              ...[
                1,
                event.payload.size,
                event.payload.distinct_size,
                commits.size,
              ],
            ) || 1
          const branch = (event.payload.ref || '').split('/').pop()

          const pushedText = event.payload.forced ? 'force pushed' : 'pushed'
          const commitText = count > 1 ? `${count} commits` : 'a commit'
          const branchText = branch === 'master' ? `to ${branch}` : ''

          return `${pushedText} ${commitText} ${branchText}`
        })()
      case 'ReleaseEvent':
        return 'published a release'
      case 'WatchEvent':
        return `starred ${repositoryText}`
      case 'WatchEvent:OneRepoMultipleUsers':
        return (() => {
          const otherUsers = event.payload.users
          const otherUsersText =
            otherUsers && otherUsers.size > 0
              ? otherUsers.size > 1
                ? `and ${otherUsers.size} others`
                : 'and 1 other'
              : ''

          return `${otherUsersText} starred ${repositoryText}`
        })()
      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          const otherRepos = event.payload.repos
          const count = (otherRepos && otherRepos.size) || 0

          return count > 1
            ? `starred ${count} repositories`
            : `starred ${repositoryText}`
        })()
      default:
        return 'did something'
    }
  })()

  return text.replace(/ {2}/g, ' ').trim()
}
