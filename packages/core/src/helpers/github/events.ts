import _ from 'lodash'
import moment from 'moment'

import {
  ActivityColumnSubscription,
  Column,
  ColumnSubscription,
  EnhancedGitHubEvent,
  GitHubCreateEvent,
  GitHubDeleteEvent,
  GitHubEvent,
  GitHubIcon,
  GitHubPullRequest,
  MultipleStarEvent,
  NotificationColumnSubscription,
} from '../../types'
import {
  isPullRequest,
  isReadFilterChecked,
  isUnreadFilterChecked,
} from './shared'

export function getOlderEventDate(events: EnhancedGitHubEvent[]) {
  const olderItem = sortEvents(events).pop()
  return olderItem && olderItem.created_at
}

export function getColumnHeaderDetails(
  column: Column,
  subscriptions: Array<ColumnSubscription | undefined>,
): {
  avatarProps?: {
    repo?: string
    username: string
  }
  icon: GitHubIcon
  subtitle?: string
  title: string
} & (
  | {
      repoIsKnown: false
      owner?: undefined
      repo?: undefined
    }
  | {
      repoIsKnown: true
      owner: string
      repo: string
    }) {
  switch (column.type) {
    case 'activity': {
      const subscription = subscriptions.filter(
        Boolean,
      )[0] as ActivityColumnSubscription

      switch (subscription.subtype) {
        case 'ORG_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: subscription.params!.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params!.org,
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
            avatarProps: {
              repo: subscription.params!.repo,
              username: subscription.params!.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: subscription.params!.owner,
            repo: subscription.params!.repo,
            subtitle: 'Activity',
            title: subscription.params!.repo,
          }
        }
        case 'REPO_NETWORK_EVENTS': {
          return {
            avatarProps: {
              repo: subscription.params!.repo,
              username: subscription.params!.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: subscription.params!.owner,
            repo: subscription.params!.repo,
            subtitle: 'Network',
            title: subscription.params!.repo,
          }
        }
        case 'USER_EVENTS': {
          return {
            avatarProps: { username: subscription.params!.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params!.username,
          }
        }
        case 'USER_ORG_EVENTS': {
          return {
            avatarProps: { username: subscription.params!.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params!.org,
          }
        }
        case 'USER_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: subscription.params!.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params!.username,
          }
        }
        case 'USER_RECEIVED_EVENTS':
        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: subscription.params!.username },
            icon: 'home',
            repoIsKnown: false,
            subtitle: 'Dashboard',
            title: subscription.params!.username,
          }
        }
        default: {
          console.error(`Invalid activity type: '${(column as any).subtype}'.`)

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
      const subscription = subscriptions.filter(
        Boolean,
      )[0] as NotificationColumnSubscription

      switch (subscription.subtype) {
        case 'REPO_NOTIFICATIONS': {
          return {
            icon: 'bell',
            repoIsKnown: true,
            owner: subscription.params!.owner,
            repo: subscription.params!.repo,
            subtitle: subscription.params!.repo,
            title: 'Notifications',
          }
        }

        default: {
          return {
            icon: 'bell',
            repoIsKnown: false,
            subtitle: subscription.params.participating
              ? 'participating'
              : isReadFilterChecked(column.filters) &&
                isUnreadFilterChecked(column.filters)
              ? 'all'
              : isUnreadFilterChecked(column.filters)
              ? 'unread'
              : isReadFilterChecked(column.filters)
              ? 'read'
              : '',
            title: 'Notifications',
          }
        }
      }
    }

    default: {
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

export const eventTypes: Array<GitHubEvent['type']> = [
  'CommitCommentEvent',
  'CreateEvent',
  'DeleteEvent',
  'ForkEvent',
  'GollumEvent',
  'IssueCommentEvent',
  'IssuesEvent',
  'MemberEvent',
  'PublicEvent',
  'PullRequestEvent',
  'PullRequestReviewCommentEvent',
  'PullRequestReviewEvent',
  'PushEvent',
  'ReleaseEvent',
  'WatchEvent',
]

export function getEventTypeMetadata<T extends GitHubEvent['type']>(
  type: T,
): { icon: GitHubIcon; label: string; type: T } {
  switch (type) {
    case 'CommitCommentEvent':
      return { icon: 'comment-discussion', label: 'Commented on commit', type }

    case 'CreateEvent':
      return { icon: 'plus', label: 'Created repo, branch or tag', type }

    case 'DeleteEvent':
      return {
        icon: 'trashcan',
        label: 'Deleted repo, branch or tag',
        type,
      }

    case 'ForkEvent':
      return { icon: 'repo-forked', label: 'Forked repo', type }

    case 'GollumEvent':
      return { icon: 'book', label: 'Wiki created or updated', type }

    case 'IssueCommentEvent':
      return {
        icon: 'comment-discussion',
        label: 'Commented on issue or pr',
        type,
      }

    case 'IssuesEvent':
      return { icon: 'issue-opened', label: 'Issue state changed', type }

    case 'MemberEvent':
      return { icon: 'person', label: 'Collaborator added', type }

    case 'PublicEvent':
      return { icon: 'globe', label: 'Repository made public', type }

    case 'PullRequestEvent':
      return {
        icon: 'git-pull-request',
        label: 'Pull Request state changed',
        type,
      }

    case 'PullRequestReviewCommentEvent':
      return {
        icon: 'comment-discussion',
        label: 'Commented on pr review',
        type,
      }

    case 'PullRequestReviewEvent':
      return {
        icon: 'comment-discussion',
        label: 'Pull Request reviewed',
        type,
      }

    case 'PushEvent':
      return { icon: 'code', label: 'Pushed commit', type }

    case 'ReleaseEvent':
      return { icon: 'tag', label: 'Released new version', type }

    case 'WatchEvent':
      return { icon: 'star', label: 'Starred repository', type }

    default: {
      console.error(`Unknown event type: ${type}`)
      return { icon: 'mark-github', label: type, type }
    }
  }
}

export function getEventText(
  event: EnhancedGitHubEvent,
  options:
    | {
        includeBranch?: boolean
        issueOrPullRequestIsKnown?: boolean
        repoIsKnown?: boolean
      }
    | undefined = {},
): string {
  const { includeBranch, issueOrPullRequestIsKnown, repoIsKnown } = options

  const isDraftPR =
    ('pull_request' in event.payload &&
      event.payload.pull_request &&
      event.payload.pull_request.draft) ||
    ('issue' in event.payload &&
      isPullRequest(event.payload.issue) &&
      (event.payload.issue as GitHubPullRequest).draft)

  const issueText = issueOrPullRequestIsKnown ? 'this issue' : 'an issue'
  const pullRequestText = issueOrPullRequestIsKnown
    ? `this ${isDraftPR ? 'draft pr' : 'pr'}`
    : `a ${isDraftPR ? 'draft pr' : 'pr'}`
  const repositoryText = repoIsKnown ? 'this repository' : 'a repository'

  const text = (() => {
    switch (event.type) {
      case 'CommitCommentEvent':
        return 'Commented on a commit'
      case 'CreateEvent':
        switch (event.payload.ref_type) {
          case 'repository':
            return `Created ${repositoryText}`
          case 'branch': {
            const branch = (event.payload.ref || '').split('/').pop()
            return includeBranch && branch
              ? `Created the branch ${branch}`
              : 'Created a branch'
          }
          case 'tag':
            return 'Created a tag'
          default:
            return 'Created something'
        }
      case 'DeleteEvent':
        switch (event.payload.ref_type) {
          case 'repository':
            return `Deleted ${repositoryText}`
          case 'branch': {
            const branch = (event.payload.ref || '').split('/').pop()
            return includeBranch && branch
              ? `Deleted the branch ${branch}`
              : 'Deleted a branch'
          }
          case 'tag':
            return 'Deleted a tag'
          default:
            return 'Deleted something'
        }
      case 'GollumEvent':
        return (() => {
          const count = (event.payload.pages || []).length || 1
          const pagesText = count > 1 ? `${count} wiki pages` : 'a wiki page'
          switch (
            event.payload.pages &&
              event.payload.pages[0] &&
              event.payload.pages[0].action
          ) {
            case 'created':
              return `Created ${pagesText}`
            default:
              return `Updated ${pagesText}`
          }
        })()
      case 'ForkEvent':
        return `Forked ${repositoryText}`
      case 'IssueCommentEvent':
        return `Commented on ${
          isPullRequest(event.payload.issue) ? pullRequestText : issueText
        }`
      case 'IssuesEvent': // TODO: Fix these texts
        switch (event.payload.action) {
          case 'closed':
            return `Closed ${issueText}`
          case 'reopened':
            return `Reopened ${issueText}`
          case 'opened':
            return `Opened ${issueText}`
          case 'assigned':
            return `Assigned ${issueText}`
          case 'unassigned':
            return `Unassigned ${issueText}`
          case 'labeled':
            return `Labeled ${issueText}`
          case 'unlabeled':
            return `Unlabeled ${issueText}`
          case 'edited':
            return `Edited ${issueText}`
          case 'milestoned':
            return `Milestoned ${issueText}`
          case 'demilestoned':
            return `Demilestoned ${issueText}`
          default:
            return `Interacted with ${issueText}`
        }
      case 'MemberEvent':
        return `Added an user ${repositoryText && `to ${repositoryText}`}`
      case 'PublicEvent':
        return `Made ${repositoryText} public`
      case 'PullRequestEvent':
        switch (event.payload.action) {
          case 'assigned':
            return `Assigned ${pullRequestText}`
          case 'unassigned':
            return `Unassigned ${pullRequestText}`
          case 'labeled':
            return `Labeled ${pullRequestText}`
          case 'unlabeled':
            return `Unlabeled ${pullRequestText}`
          case 'opened':
            return `Opened ${pullRequestText}`
          case 'edited':
            return `Edited ${pullRequestText}`

          case 'closed':
            return event.payload.pull_request.merged_at
              ? `Merged ${pullRequestText}`
              : `Closed ${pullRequestText}`

          case 'reopened':
            return `Reopened ${pullRequestText}`
          default:
            return `Interacted with ${pullRequestText}`
        }
      case 'PullRequestReviewEvent':
        return `Reviewed ${pullRequestText}`
      case 'PullRequestReviewCommentEvent':
        switch (event.payload.action) {
          case 'created':
            return `Commented on ${pullRequestText} review`
          case 'edited':
            return `Edited ${pullRequestText} review`
          case 'deleted':
            return `Deleted ${pullRequestText} review`
          default:
            return `Interacted with ${pullRequestText} review`
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
          const pushedText = event.forced ? 'Force pushed' : 'Pushed'
          const commitText = count > 1 ? `${count} commits` : 'a commit'
          const branchText = includeBranch && branch ? `to ${branch}` : ''

          return `${pushedText} ${commitText} ${branchText}`.trim()
        })()
      }
      case 'ReleaseEvent':
        return 'Published a release'
      case 'WatchEvent':
        return `Starred ${repositoryText}`
      case 'WatchEvent:OneUserMultipleRepos':
        return (() => {
          return event.repos.length > 1
            ? `Starred ${event.repos.length} repositories`
            : `Starred ${repositoryText}`
        })()
      default:
        return 'Did something'
    }
  })()

  return text.replace(/ {2}/g, ' ').trim()
}

function tryMerge(eventA: EnhancedGitHubEvent, eventB: EnhancedGitHubEvent) {
  if (!eventA || !eventB) return null

  const isSameUser =
    eventA.actor && eventB.actor && eventA.actor.id === eventB.actor.id

  const isSameRepo =
    'repo' in eventA &&
    eventA.repo &&
    ('repo' in eventB && eventB.repo && eventA.repo.id === eventB.repo.id)

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
      if (eventB.type === 'WatchEvent') {
        if (isSameRepo) return eventB

        return {
          ..._.omit(eventA, ['repo', 'type']),
          type: 'WatchEvent:OneUserMultipleRepos',
          repos: [eventA.repo, eventB.repo],
          merged: [eventA.id, eventB.id],
        } as MultipleStarEvent
      }

      return null
    }

    case 'WatchEvent:OneUserMultipleRepos': {
      const repoBId = 'repo' in eventB && eventB.repo && eventB.repo.id
      const alreadyMergedThisRepo = eventA.repos.find(
        repo => repo.id === repoBId,
      )
      if (eventB.type === 'WatchEvent') {
        return {
          ...eventA,
          repos: _.uniqBy([...eventA.repos, eventB.repo], repo => repo.id),
          merged: alreadyMergedThisRepo
            ? _.uniq(eventA.merged)
            : _.uniq([...eventA.merged, eventB.id]),
        } as MultipleStarEvent
      }

      return null
    }

    default:
      return null
  }
}

export function mergeSimilarEvents(events: EnhancedGitHubEvent[]) {
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

export function isBranchMainEvent(event: EnhancedGitHubEvent) {
  if (!(event && event.type)) return false

  if (event.type === 'PushEvent') return true

  if (
    event.type === 'CreateEvent' &&
    (event.payload as GitHubCreateEvent['payload']).ref_type === 'branch'
  )
    return true

  if (
    event.type === 'DeleteEvent' &&
    (event.payload as GitHubDeleteEvent['payload']).ref_type === 'branch'
  )
    return true

  return false
}

export function sortEvents(events: EnhancedGitHubEvent[] | undefined) {
  if (!events) return []
  return _(events)
    .uniqBy('id')
    .orderBy('created_at', 'desc')
    .value()
}
