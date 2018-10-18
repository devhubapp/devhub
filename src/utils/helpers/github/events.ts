import moment from 'moment'
import { omit, uniq, uniqBy } from 'ramda'

import * as colors from '../../../styles/colors'

import {
  getIssueIconAndColor,
  getPullRequestIconAndColor,
  isPullRequest,
} from './shared'

import {
  Column,
  EnhancedGitHubEvent,
  GitHubEvent,
  GitHubIcon,
  GitHubIssue,
  GitHubPullRequest,
  MultipleStarEvent,
} from '../../../types'

export function getColumnHeaderDetails(
  column: Column,
): {
  avatarDetails?: {
    owner: string
    repo?: string
  }
  icon: GitHubIcon
  repoIsKnown: boolean
  subtitle?: string
  title: string
} {
  switch (column.type) {
    case 'activity': {
      switch (column.subtype) {
        case 'ORG_PUBLIC_EVENTS': {
          return {
            avatarDetails: { owner: column.params.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: column.params.org,
          }
        }
        case 'PUBLIC_EVENTS': {
          return {
            icon: 'rss',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: 'Public',
          }
        }
        case 'REPO_EVENTS': {
          return {
            avatarDetails: {
              owner: column.params.owner,
              repo: column.params.repo,
            },
            icon: 'repo',
            repoIsKnown: true,
            subtitle: 'Activity',
            title: column.params.repo,
          }
        }
        case 'REPO_NETWORK_EVENTS': {
          return {
            avatarDetails: {
              owner: column.params.owner,
              repo: column.params.repo,
            },
            icon: 'repo',
            repoIsKnown: true,
            subtitle: 'Network',
            title: column.params.repo,
          }
        }
        case 'USER_EVENTS': {
          return {
            avatarDetails: { owner: column.params.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: column.params.username,
          }
        }
        case 'USER_ORG_EVENTS': {
          return {
            avatarDetails: { owner: column.params.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: column.params.org,
          }
        }
        case 'USER_PUBLIC_EVENTS': {
          return {
            avatarDetails: { owner: column.params.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: column.params.username,
          }
        }
        case 'USER_RECEIVED_EVENTS':
        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          return {
            avatarDetails: { owner: column.params.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Dashboard',
            title: column.params.username,
          }
        }
        default: {
          if (__DEV__)
            console.error(
              `Invalid activity type: '${(column as any).subtype}'.`,
            )
          return {
            icon: 'mark-github',
            repoIsKnown: false,
            subtitle: (column as any).subtype || '',
            title: 'Unknown',
          }
        }
      }
    }

    case 'notifications': {
      return {
        icon: 'bell',
        repoIsKnown: false,
        subtitle: column.params.all ? 'All' : '',
        title: 'Notifications',
      }
    }

    default: {
      if (__DEV__)
        console.error(`Invalid column type: '${(column as any).type}'.`)
      return {
        icon: 'mark-github',
        repoIsKnown: false,
        subtitle: (column as any).type || '',
        title: 'Unknown',
      }
    }
  }
}

export function getEventIconAndColor(
  event: EnhancedGitHubEvent,
): { color?: string; icon: GitHubIcon; subIcon?: GitHubIcon } {
  switch (event.type) {
    case 'CommitCommentEvent':
      return { icon: 'git-commit', subIcon: 'comment-discussion' }
    case 'CreateEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo' }
        case 'branch':
          return { icon: 'git-branch' }
        case 'tag':
          return { icon: 'tag' }
        default:
          return { icon: 'plus' }
      }
    }
    case 'DeleteEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo', color: colors.red }
        case 'branch':
          return { icon: 'git-branch', color: colors.red }
        case 'tag':
          return { icon: 'tag', color: colors.red }
        default:
          return { icon: 'trashcan' }
      }
    }
    case 'GollumEvent':
      return { icon: 'book' }
    case 'ForkEvent':
      return { icon: 'repo-forked' }

    case 'IssueCommentEvent': {
      return {
        ...(isPullRequest(event.payload.issue)
          ? getPullRequestIconAndColor(event.payload.issue)
          : getIssueIconAndColor(event.payload.issue)),
        subIcon: 'comment-discussion',
      }
    }

    case 'IssuesEvent': {
      const issue = event.payload.issue

      switch (event.payload.action) {
        case 'opened':
          return getIssueIconAndColor({ state: 'open' } as GitHubIssue)
        case 'closed':
          return getIssueIconAndColor({ state: 'closed' } as GitHubIssue)

        case 'reopened':
          return {
            ...getIssueIconAndColor({ state: 'open' } as GitHubIssue),
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
          return getIssueIconAndColor(issue)
      }
    }
    case 'MemberEvent':
      return { icon: 'person' }
    case 'PublicEvent':
      return { icon: 'globe', color: colors.blue }

    case 'PullRequestEvent':
      return (() => {
        const pullRequest = event.payload.pull_request

        switch (event.payload.action) {
          case 'opened':
          case 'reopened':
            return getPullRequestIconAndColor({
              state: 'open',
            } as GitHubPullRequest)
          // case 'closed': return getPullRequestIconAndColor({ state: 'closed' } as GitHubPullRequest);

          // case 'assigned':
          // case 'unassigned':
          // case 'labeled':
          // case 'unlabeled':
          // case 'edited':
          default:
            return getPullRequestIconAndColor(pullRequest)
        }
      })()

    case 'PullRequestReviewEvent':
    case 'PullRequestReviewCommentEvent': {
      return {
        ...getPullRequestIconAndColor(event.payload.pull_request),
        subIcon: 'comment-discussion',
      }
    }

    case 'PushEvent':
      return { icon: 'code' }
    case 'ReleaseEvent':
      return { icon: 'tag' }
    case 'WatchEvent':
    case 'WatchEvent:OneUserMultipleRepos':
      return { icon: 'star', color: colors.star }
    default:
      return { icon: 'mark-github' }
  }
}

export function getEventText(
  event: EnhancedGitHubEvent,
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
        switch (event.payload.action) {
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
      case 'PushEvent': {
        return (() => {
          const commits = event.payload.commits || [{}]
          // const commit = event.payload.head_commit || commits[0];
          const count =
            Math.max(
              ...[
                1,
                event.payload.size,
                event.payload.distinct_size,
                commits.length,
              ],
            ) || 1
          const branch = (event.payload.ref || '').split('/').pop()

          const pushedText = event.forced ? 'force pushed' : 'pushed'
          const commitText = count > 1 ? `${count} commits` : 'a commit'
          const branchText = branch === 'master' ? `to ${branch}` : ''

          return `${pushedText} ${commitText} ${branchText}`
        })()
      }
      case 'ReleaseEvent':
        return 'published a release'
      case 'WatchEvent':
        return `starred ${repositoryText}`
      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          return event.repos.length > 1
            ? `starred ${event.repos.length} repositories`
            : `starred ${repositoryText}`
        })()
      default:
        return 'did something'
    }
  })()

  return text.replace(/ {2}/g, ' ').trim()
}

function tryMerge(eventA: EnhancedGitHubEvent, eventB: GitHubEvent) {
  if (!eventA || !eventB) return null

  const isSameUser =
    eventA.actor && eventB.actor && eventA.actor.id === eventB.actor.id

  const isSameRepo =
    'repo' in eventA &&
    eventA.repo &&
    eventB.repo &&
    eventA.repo.id === eventB.repo.id

  const createdAtMinutesDiff = moment(eventA.created_at).diff(
    moment(eventB.created_at),
    'minutes',
  )

  // only merge events from the same user
  if (!isSameUser) return null

  // only merge events that were created in the same hour
  if (createdAtMinutesDiff >= 24 * 60) return null

  // only merge 5 events at max
  if ('merged' in eventA && eventA.merged && eventA.merged.length >= 5)
    return null

  switch (eventA.type) {
    case 'WatchEvent': {
      if (eventB.type === 'WatchEvent' && !isSameRepo) {
        return {
          ...omit(['repo', 'type'], eventA),
          type: 'WatchEvent:OneUserMultipleRepos',
          repos: [eventA.repo, eventB.repo],
          merged: [eventA.id, eventB.id],
        } as MultipleStarEvent
      }

      return null
    }

    case 'WatchEvent:OneUserMultipleRepos': {
      const repoBId = eventB.repo && eventB.repo.id
      const alreadyMergedThisRepo = eventA.repos.find(
        repo => repo.id === repoBId,
      )
      if (eventB.type === 'WatchEvent' && !alreadyMergedThisRepo) {
        return {
          ...eventA,
          repos: uniqBy(repo => repo.id, [...eventA.repos, eventB.repo]),
          merged: uniq([...eventA.merged, eventB.id]),
        } as MultipleStarEvent
      }

      return null
    }

    default:
      return null
  }
}

export function mergeSimilarEvent(events: GitHubEvent[]) {
  const enhancedEvents: EnhancedGitHubEvent[] = []

  let enhancedEvent: EnhancedGitHubEvent | null = null

  events.filter(Boolean).forEach(event => {
    if (!enhancedEvent) {
      enhancedEvent = event
      return
    }

    const mergedEvent = tryMerge(enhancedEvent, event)

    if (!mergedEvent) {
      enhancedEvents.push(enhancedEvent)
      enhancedEvent = event
      return
    }

    enhancedEvent = mergedEvent
  })

  if (enhancedEvent) enhancedEvents.push(enhancedEvent)

  return enhancedEvents.length === events.length ? events : enhancedEvents
}
