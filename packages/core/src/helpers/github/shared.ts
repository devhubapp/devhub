import gravatar from 'gravatar'
import qs from 'qs'

import {
  ActivityColumnSubscription,
  Column,
  ColumnFilters,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  GitHubAPIHeaders,
  GitHubIcon,
  GitHubPullRequest,
  IssueOrPullRequestColumnSubscription,
  NotificationColumnSubscription,
} from '../../types'
import { getSteppedSize } from '../shared'

export function isItemRead(
  item:
    | EnhancedGitHubNotification
    | EnhancedGitHubEvent
    | EnhancedGitHubIssueOrPullRequest,
) {
  return !(item && (item.unread !== false || item.forceUnreadLocally))
}

export function isReadFilterChecked(filters: ColumnFilters | undefined) {
  return !(filters && filters.unread === true)
}

export function isUnreadFilterChecked(filters: ColumnFilters | undefined) {
  return !(filters && filters.unread === false)
}

export function getUserAvatarByAvatarURL(
  avatarUrl: string,
  { size }: { size?: number } = {},
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  if (!avatarUrl) return ''

  const _avatarUrl = avatarUrl.indexOf('?') > 0 ? avatarUrl : `${avatarUrl}?`
  const [url, _querystring] = _avatarUrl.split('?')
  const query = qs.parse(_querystring)
  const querystring = qs.stringify({
    ...query,
    size: getSteppedSize(size, undefined, getPixelSizeForLayoutSizeFn),
  })

  return `${url}?${querystring}`
}

export function getUserAvatarByUsername(
  username: string,
  { size }: { size?: number } = {},
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  return username
    ? `https://github.com/${username}.png?size=${getSteppedSize(
        size,
        undefined,
        getPixelSizeForLayoutSizeFn,
      )}`
    : ''
}

export function tryGetUsernameFromGitHubEmail(email?: string) {
  if (!email) return ''

  const emailSplit = email.split('@')
  if (emailSplit.length === 2 && emailSplit[1] === 'users.noreply.github.com')
    return (emailSplit[0] || '').split('+').pop()

  return ''
}

export function getUserAvatarByEmail(
  email: string,
  { size, ...otherOptions }: { size?: number } = {},
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  const steppedSize = getSteppedSize(
    size,
    undefined,
    getPixelSizeForLayoutSizeFn,
  )
  const username = tryGetUsernameFromGitHubEmail(email)
  if (username)
    return getUserAvatarByUsername(
      username,
      { size: steppedSize },
      getPixelSizeForLayoutSizeFn,
    )

  const options = { size: `${steppedSize || ''}`, d: 'retro', ...otherOptions }
  return `https:${gravatar.url(email, options)}`.replace('??', '?')
}

export function isPullRequest(issue: {
  merged_at?: GitHubPullRequest['merged_at']
  html_url?: GitHubPullRequest['html_url']
  url?: GitHubPullRequest['url']
}) {
  return (
    issue &&
    ((issue as GitHubPullRequest).merged_at ||
      (issue.html_url && issue.html_url.indexOf('pull') >= 0) ||
      (issue.url && issue.url.indexOf('pull') >= 0))
  )
}

export function getOwnerAndRepo(
  repoFullName: string,
): { owner: string | undefined; repo: string | undefined } {
  if (!repoFullName) return { owner: '', repo: '' }

  const repoSplitedNames = (repoFullName || '')
    .trim()
    .split('/')
    .filter(Boolean)

  const owner = (repoSplitedNames[0] || '').trim()
  const repo = (repoSplitedNames[1] || '').trim()

  return { owner, repo }
}

export function getUniqueIdForSubscription(subscription: {
  type: ColumnSubscription['type']
  subtype?: ColumnSubscription['subtype'] | undefined
  params: ColumnSubscription['params']
}) {
  const s = subscription as ColumnSubscription

  switch (s.type) {
    case 'activity': {
      switch (s.subtype) {
        case 'PUBLIC_EVENTS': {
          return '/events'
        }

        case 'REPO_EVENTS': {
          const { owner, repo } = s.params!
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/repos/${owner}/${repo}/events`.toLowerCase()
        }

        case 'REPO_NETWORK_EVENTS': {
          const { owner, repo } = s.params!
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/networks/${owner}/${repo}/events`.toLowerCase()
        }

        case 'ORG_PUBLIC_EVENTS': {
          const { org } = s.params!
          if (!org) throw new Error('Required params: org')
          return `/orgs/${org}/events`.toLowerCase()
        }

        case 'USER_RECEIVED_EVENTS': {
          const { username } = s.params!
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/received_events`.toLowerCase()
        }

        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          const { username } = s.params!
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/received_events/public`.toLowerCase()
        }

        case 'USER_EVENTS': {
          const { username } = s.params!
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/events`.toLowerCase()
        }

        case 'USER_PUBLIC_EVENTS': {
          const { username } = s.params!
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/events/public`.toLowerCase()
        }

        case 'USER_ORG_EVENTS': {
          const { org, username } = s.params!
          if (!(username && org))
            throw new Error('Required params: username, org')
          return `/users/${username}/events/orgs/${org}`.toLowerCase()
        }

        default: {
          throw new Error(
            `No path configured for subscription type ${(s as any).type}: '${
              (s as any).subtype
            }'`,
          )
        }
      }
    }

    case 'issue_or_pr': {
      switch (s.subtype) {
        case 'ISSUES': {
          const { owner, repo } = s.params!
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/repos/${owner}/${repo}/issues`.toLowerCase()
        }

        case 'PULLS': {
          const { owner, repo } = s.params!
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/repos/${owner}/${repo}/pulls`.toLowerCase()
        }

        default: {
          throw new Error(
            `No path configured for subscription type ${(s as any).type}: '${
              (s as any).subtype
            }'`,
          )
        }
      }
    }

    case 'notifications': {
      const _querystring = qs.stringify({
        all: !!s.params.all,
        participating: !!s.params.participating,
      })
      const querystring = _querystring ? `?${_querystring}` : ''

      switch (s.subtype) {
        case 'REPO_NOTIFICATIONS': {
          const { owner, repo } = s.params!
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/repos/${owner}/${repo}/notifications${querystring}`.toLowerCase()
        }

        default: {
          return `/notifications${querystring}`
        }
      }
    }

    default:
      throw new Error(`Unknown subscription type: ${(s as any).type}`)
  }
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

    case 'issue_or_pr': {
      const subscription = subscriptions.filter(
        Boolean,
      )[0] as IssueOrPullRequestColumnSubscription

      switch (subscription.subtype) {
        case 'ISSUES': {
          return {
            avatarProps: {
              repo: subscription.params!.repo,
              username: subscription.params!.owner,
            },
            icon: 'issue-opened',
            repoIsKnown: true,
            owner: subscription.params!.owner,
            repo: subscription.params!.repo,
            subtitle: 'Issues',
            title: subscription.params!.repo,
          }
        }

        case 'PULLS': {
          return {
            avatarProps: {
              repo: subscription.params!.repo,
              username: subscription.params!.owner,
            },
            icon: 'git-pull-request',
            repoIsKnown: true,
            owner: subscription.params!.owner,
            repo: subscription.params!.repo,
            subtitle: 'Pull Requests',
            title: subscription.params!.repo,
          }
        }

        default: {
          return {
            avatarProps: {
              repo: subscription.params!.repo,
              username: subscription.params!.owner,
            },
            icon: 'issue-opened',
            repoIsKnown: false,
            subtitle: 'Issues & PRs',
            title: subscription.params!.repo,
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

export function createSubscriptionObjectWithId(
  subscription: Pick<ColumnSubscription, 'type' | 'subtype' | 'params'>,
) {
  return {
    ...subscription,
    id: getUniqueIdForSubscription(subscription),
  }
}

export function createSubscriptionObjectsWithId(
  subscriptions: Array<Pick<ColumnSubscription, 'type' | 'subtype' | 'params'>>,
) {
  return (subscriptions as ColumnSubscription[]).map(subscription => ({
    ...subscription,
    id: getUniqueIdForSubscription(subscription),
  }))
}

export function getGitHubAPIHeadersFromHeader(headers: Record<string, any>) {
  const github: GitHubAPIHeaders = {}

  if (!headers) return github

  if (typeof headers['x-poll-interval'] !== 'undefined')
    github.pollInterval = parseInt(headers['x-poll-interval'], 10)

  if (typeof headers['x-ratelimit-limit'] !== 'undefined')
    github.rateLimitLimit = parseInt(headers['x-ratelimit-limit'], 10)

  if (typeof headers['x-ratelimit-remaining'] !== 'undefined')
    github.rateLimitRemaining = parseInt(headers['x-ratelimit-remaining'], 10)

  if (typeof headers['x-ratelimit-reset'] !== 'undefined')
    github.rateLimitReset = parseInt(headers['x-ratelimit-reset'], 10)

  return github
}

export function getBranchNameFromRef(ref: string | undefined) {
  if (!(ref && ref.startsWith('refs/'))) return ref || undefined

  return ref
    .split('/')
    .slice(2)
    .join('/')
}
