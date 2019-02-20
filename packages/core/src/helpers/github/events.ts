import _ from 'lodash'
import moment from 'moment'

import {
  ActivityColumnSubscription,
  Column,
  ColumnSubscription,
  EnhancedGitHubEvent,
  GitHubEvent,
  GitHubIcon,
  GitHubPullRequest,
  MultipleStarEvent,
  NotificationColumnSubscription,
} from '../../types'
import { isPullRequest } from './shared'

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
            avatarProps: { username: subscription.params.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params.org,
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
              repo: subscription.params.repo,
              username: subscription.params.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: subscription.params.owner,
            repo: subscription.params.repo,
            subtitle: 'Activity',
            title: subscription.params.repo,
          }
        }
        case 'REPO_NETWORK_EVENTS': {
          return {
            avatarProps: {
              repo: subscription.params.repo,
              username: subscription.params.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: subscription.params.owner,
            repo: subscription.params.repo,
            subtitle: 'Network',
            title: subscription.params.repo,
          }
        }
        case 'USER_EVENTS': {
          return {
            avatarProps: { username: subscription.params.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params.username,
          }
        }
        case 'USER_ORG_EVENTS': {
          return {
            avatarProps: { username: subscription.params.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params.org,
          }
        }
        case 'USER_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: subscription.params.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: subscription.params.username,
          }
        }
        case 'USER_RECEIVED_EVENTS':
        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: subscription.params.username },
            icon: 'home',
            repoIsKnown: false,
            subtitle: 'Dashboard',
            title: subscription.params.username,
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
            owner: subscription.params.owner,
            repo: subscription.params.repo,
            subtitle: subscription.params.repo,
            title: 'Notifications',
          }
        }

        default: {
          return {
            icon: 'bell',
            repoIsKnown: false,
            subtitle: subscription.params.participating
              ? 'participating'
              : subscription.params.all
              ? 'all'
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
      return { icon: 'issue-opened', label: 'Issue opened or closed', type }

    case 'MemberEvent':
      return { icon: 'person', label: 'Collaborator added', type }

    case 'PublicEvent':
      return { icon: 'globe', label: 'Repository made public', type }

    case 'PullRequestEvent':
      return {
        icon: 'git-pull-request',
        label: 'Pull Request opened or closed',
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
        issueOrPullRequestIsKnown?: boolean
        repoIsKnown?: boolean
      }
    | undefined = {},
): string {
  const { issueOrPullRequestIsKnown, repoIsKnown } = options

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
          switch (
            event.payload.pages &&
              event.payload.pages[0] &&
              event.payload.pages[0].action
          ) {
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

export function sortEvents(events: EnhancedGitHubEvent[] | undefined) {
  if (!events) return []
  return _(events)
    .uniqBy('id')
    .orderBy('created_at', 'desc')
    .value()
}
