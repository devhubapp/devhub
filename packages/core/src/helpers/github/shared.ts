import gravatar from 'gravatar'
import _ from 'lodash'
import qs from 'qs'

import {
  ActivityColumnSubscription,
  Column,
  ColumnFilters,
  ColumnSubscription,
  EnhancedGitHubEvent,
  EnhancedGitHubIssue,
  EnhancedGitHubIssueOrPullRequest,
  EnhancedGitHubNotification,
  EnhancedGitHubPullRequest,
  EnhancedItem,
  GitHubAPIHeaders,
  GitHubEvent,
  GitHubIcon,
  GitHubIssueOrPullRequest,
  GitHubItemSubjectType,
  GitHubPrivacy,
  GitHubPullRequest,
  GitHubPushedCommit,
  GitHubPushEvent,
  GitHubRepo,
  GitHubStateType,
  IssueOrPullRequestColumnSubscription,
  ItemFilterCountMetadata,
  ItemsFilterMetadata,
  MultipleStarEvent,
  NotificationColumnSubscription,
  ThemeColors,
} from '../../types'
import {
  getFilteredEvents,
  getFilteredIssueOrPullRequests,
  getFilteredNotifications,
} from '../filters'
import {
  getSteppedSize,
  isEventPrivate,
  isNotificationPrivate,
} from '../shared'
import { getEventMetadata } from './events'
import {
  getGitHubIssueSearchQuery,
  getIssueOrPullRequestState,
  getIssueOrPullRequestSubjectType,
} from './issues'
import { getNotificationSubjectType } from './notifications'
import { getRepoFullNameFromUrl } from './url'

const GITHUB_USERNAME_REGEX_PATTERN = '[a-zd](?:[a-zd]|-(?=[a-zd])){0,38}'
export const GITHUB_USERNAME_REGEX = new RegExp(
  `^${GITHUB_USERNAME_REGEX_PATTERN}$`,
  'i',
)

const GITHUB_REPO_NAME_REGEX_PATTERN = GITHUB_USERNAME_REGEX_PATTERN
export const GITHUB_REPO_NAME_REGEX = new RegExp(
  `^${GITHUB_REPO_NAME_REGEX_PATTERN}$`,
  'i',
)

const GITHUB_REPO_FULL_NAME_FORMAT_REGEX_PATTERN = '([^/]+)/([^/]+)'
export const GITHUB_REPO_FULL_NAME_FORMAT_REGEX = new RegExp(
  `^${GITHUB_REPO_FULL_NAME_FORMAT_REGEX_PATTERN}$`,
  'i',
)

const GITHUB_REPO_FULL_NAME_REGEX_PATTERN = `(${GITHUB_USERNAME_REGEX_PATTERN})/(${GITHUB_REPO_NAME_REGEX_PATTERN})`
export const GITHUB_REPO_FULL_NAME_REGEX = new RegExp(
  `^${GITHUB_REPO_FULL_NAME_REGEX_PATTERN}$`,
  'i',
)

export function isGitHubUsernameValid(username: string) {
  if (!username) return false
  return !!username.match(GITHUB_USERNAME_REGEX)
}

export function isGitHubRepoNameValid(repoName: string) {
  if (!repoName) return false
  return !!repoName.match(GITHUB_REPO_NAME_REGEX)
}

export function isGitHubOwnerAndRepoValid(repoFullName: string) {
  if (!repoFullName) return false
  return !!repoFullName.match(GITHUB_REPO_FULL_NAME_REGEX)
}

export function getDefaultPaginationPerPage(columnType: Column['type']) {
  if (columnType === 'activity') return 50
  if (columnType === 'issue_or_pr') return 10
  if (columnType === 'notifications') return 50

  return 10
}

export function isItemRead(item: EnhancedItem) {
  return !(item && (item.unread !== false || item.forceUnreadLocally))
}

export function isReadFilterChecked(filters: ColumnFilters | undefined) {
  return !(filters && filters.unread === true)
}

export function isUnreadFilterChecked(filters: ColumnFilters | undefined) {
  return !(filters && filters.unread === false)
}

export function isDraft(
  pullRequest:
    | {
        draft?: GitHubPullRequest['draft']
        mergeable_state?: GitHubPullRequest['mergeable_state'] | undefined
      }
    | undefined,
) {
  if (!pullRequest) return false
  return !!pullRequest.draft || pullRequest.mergeable_state === 'draft'
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
  pull_request?: object
  merged_at?: GitHubPullRequest['merged_at']
  html_url?: GitHubPullRequest['html_url']
  url?: GitHubPullRequest['url']
}) {
  return !!(
    issue &&
    ((issue as GitHubPullRequest).merged_at ||
      issue.pull_request ||
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
      if (!s.subtype || (s.subtype === 'ISSUES' || s.subtype === 'PULLS')) {
        return `/search/issues?q=${getGitHubIssueSearchQuery(s.params)}`
      }
      throw new Error(
        `No path configured for subscription type ${(s as any).type}: '${
          (s as any).subtype
        }'`,
      )
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
      throw new Error(`Unknown subscription type: ${s && (s as any).type}`)
  }
}

export function getColumnHeaderDetails(
  column: Column | undefined,
  subscription: ColumnSubscription | undefined,
):
  | {
      avatarProps?: {
        repo?: string
        username: string
      }
      icon: GitHubIcon
      owner?: string
      repo?: string
      repoIsKnown: boolean
      subtitle?: string
      title: string
    }
  | undefined {
  if (!column) return undefined

  switch (column && column.type) {
    case 'activity': {
      const s = (subscription || {}) as Partial<ActivityColumnSubscription>

      switch (s.subtype) {
        case 'ORG_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: s.params!.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.org,
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
              repo: s.params!.repo,
              username: s.params!.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: s.params!.owner,
            repo: s.params!.repo,
            subtitle: 'Activity',
            title: s.params!.repo,
          }
        }
        case 'REPO_NETWORK_EVENTS': {
          return {
            avatarProps: {
              repo: s.params!.repo,
              username: s.params!.owner,
            },
            icon: 'repo',
            repoIsKnown: true,
            owner: s.params!.owner,
            repo: s.params!.repo,
            subtitle: 'Network',
            title: s.params!.repo,
          }
        }
        case 'USER_EVENTS': {
          return {
            avatarProps: { username: s.params!.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.username,
          }
        }
        case 'USER_ORG_EVENTS': {
          return {
            avatarProps: { username: s.params!.org },
            icon: 'organization',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.org,
          }
        }
        case 'USER_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: s.params!.username },
            icon: 'person',
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.username,
          }
        }
        case 'USER_RECEIVED_EVENTS':
        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: s.params!.username },
            icon: 'home',
            repoIsKnown: false,
            subtitle: 'Dashboard',
            title: s.params!.username,
          }
        }
        default: {
          console.error(
            `Invalid activity subtype: '${column && (column as any).subtype}'.`,
            { column, subscription },
          )

          return {
            icon: 'mark-github',
            repoIsKnown: false,
            subtitle: (column && (column as any).subtype) || '',
            title: 'Unknown',
          }
        }
      }
    }

    case 'issue_or_pr': {
      const s = (subscription || {}) as Partial<
        IssueOrPullRequestColumnSubscription
      >

      const ownerAndRepo = getOwnerAndRepo(
        (s && s.params && s.params.repoFullName) || '',
      )
      const owner = ownerAndRepo.owner!
      const repo = ownerAndRepo.repo!

      const involvesSuffix =
        s.params &&
        s.params.involves &&
        Object.keys(s.params.involves).length === 1 &&
        (s.params.involves[Object.keys(s.params.involves)[0]] === true
          ? ` involving ${Object.keys(s.params.involves)[0]}`
          : s.params.involves[Object.keys(s.params.involves)[0]] === false
          ? ` not involving ${Object.keys(s.params.involves)[0]}`
          : '')

      switch (s && s.subtype) {
        case 'ISSUES': {
          return {
            avatarProps: {
              repo,
              username: owner,
            },
            icon: 'issue-opened',
            repoIsKnown: !!(owner && repo),
            owner,
            repo,
            subtitle: `Issues${involvesSuffix}`,
            title: repo,
          }
        }

        case 'PULLS': {
          return {
            avatarProps: {
              repo,
              username: owner,
            },
            icon: 'git-pull-request',
            repoIsKnown: !!(owner && repo),
            owner,
            repo,
            subtitle: `Pull Requests${involvesSuffix}`,
            title: repo,
          }
        }

        default: {
          return {
            avatarProps: {
              repo,
              username: owner,
            },
            icon: 'issue-opened',
            repoIsKnown: !!(owner && repo),
            subtitle: `Issues & PRs${involvesSuffix}`,
            title: repo,
          }
        }
      }
    }

    case 'notifications': {
      const s = (subscription || {}) as Partial<NotificationColumnSubscription>

      switch (s.subtype) {
        case 'REPO_NOTIFICATIONS': {
          return {
            icon: 'bell',
            repoIsKnown: true,
            owner: (s && s.params && s.params.owner) || '',
            repo: (s && s.params && s.params.repo) || '',
            subtitle: (s && s.params && s.params.repo) || '',
            title: 'Notifications',
          }
        }

        default: {
          return {
            icon: 'bell',
            repoIsKnown: false,
            subtitle:
              s && s.params && s.params.participating
                ? 'participating'
                : isReadFilterChecked(column && column.filters) &&
                  isUnreadFilterChecked(column && column.filters)
                ? 'all'
                : isUnreadFilterChecked(column && column.filters)
                ? 'unread'
                : isReadFilterChecked(column && column.filters)
                ? 'read'
                : '',
            title: 'Notifications',
          }
        }
      }
    }

    default: {
      console.error(
        `Invalid column type: '${column && (column as any).type}'.`,
        {
          column,
          subscription,
        },
      )
      return {
        icon: 'mark-github',
        repoIsKnown: false,
        subtitle: (column && (column as any).type) || '',
        title: 'Unknown',
      }
    }
  }
}

export function createSubscriptionObjectWithId<
  S extends Pick<ColumnSubscription, 'type' | 'subtype' | 'params'>
>(subscription: S) {
  return {
    ...subscription,
    id: getUniqueIdForSubscription(subscription),
  }
}

export function createSubscriptionObjectsWithId<
  S extends Array<Pick<ColumnSubscription, 'type' | 'subtype' | 'params'>>
>(subscriptions: S) {
  return subscriptions.map(subscription => ({
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
export const issueOrPullRequestStateTypes: GitHubStateType[] = [
  'open',
  'closed',
  'merged',
]

export function getCommitIconAndColor(): {
  icon: GitHubIcon
  color?: keyof ThemeColors
  tooltip: string
} {
  return { icon: 'git-commit', color: 'blueGray', tooltip: 'Commit' }
}

export function getReleaseIconAndColor(): {
  icon: GitHubIcon
  color?: keyof ThemeColors
  tooltip: string
} {
  return {
    icon: 'rocket',
    color: 'pink',
    tooltip: 'Release',
  }
}

export function getTagIconAndColor(): {
  icon: GitHubIcon
  color?: keyof ThemeColors
  tooltip: string
} {
  return {
    icon: 'tag',
    color: 'gray',
    tooltip: 'Tag',
  }
}

export function getPullRequestIconAndColor(pullRequest: {
  draft: GitHubPullRequest['draft']
  state: GitHubPullRequest['state']
  merged: GitHubPullRequest['merged'] | undefined
  merged_at: GitHubPullRequest['merged_at'] | undefined
  mergeable_state: GitHubPullRequest['mergeable_state'] | undefined
}): { icon: GitHubIcon; color?: keyof ThemeColors; tooltip: string } {
  const draft = isDraft(pullRequest)
  const merged = !!(pullRequest.merged || pullRequest.merged_at)
  const state = merged ? 'merged' : pullRequest.state

  switch (state) {
    case 'open':
      return {
        icon: 'git-pull-request',
        color: draft ? 'gray' : 'green',
        tooltip: `Open${draft ? ' draft' : ''} pull request`,
      }

    case 'closed':
      return {
        icon: 'git-pull-request',
        color: 'lightRed',
        tooltip: `Closed${draft ? ' draft' : ''} pull request`,
      }

    case 'merged':
      return {
        icon: 'git-merge',
        color: 'purple',
        tooltip: `Merged pull request`,
      }

    default:
      return {
        icon: 'git-pull-request',
        tooltip: 'Pull Request',
      }
  }
}

export function getIssueIconAndColor(issue: {
  state?: GitHubPullRequest['state']
  merged_at?: GitHubPullRequest['merged_at']
}): { icon: GitHubIcon; color?: keyof ThemeColors; tooltip: string } {
  const { state } = issue

  if (isPullRequest(issue)) {
    return getPullRequestIconAndColor(issue as GitHubPullRequest)
  }

  switch (state) {
    case 'open':
      return {
        icon: 'issue-opened',
        color: 'green',
        tooltip: `Open issue`,
      }

    case 'closed':
      return {
        icon: 'issue-closed',
        color: 'lightRed',
        tooltip: 'Closed issue',
      }

    default:
      return { icon: 'issue-opened', tooltip: 'Issue' }
  }
}

export function getStateTypeMetadata<T extends GitHubStateType>(
  state: T,
): {
  color: keyof ThemeColors
  label: string
  state: T
} {
  switch (state as GitHubStateType) {
    case 'open': {
      return {
        color: 'green',
        label: 'Open',
        state,
      }
    }

    case 'closed': {
      return {
        color: 'lightRed',
        label: 'Closed',
        state,
      }
    }

    case 'merged': {
      return {
        color: 'purple',
        label: 'Merged',
        state,
      }
    }

    default: {
      return {
        color: 'primaryBackgroundColor',
        label: _.startCase(state),
        state,
      }
    }
  }
}

export function getSubjectTypeMetadata<T extends GitHubItemSubjectType>(
  subjectType: T,
): {
  color?: keyof ThemeColors
  label: string
  subjectType: T
} {
  switch (subjectType as GitHubItemSubjectType) {
    case 'PullRequestReview': {
      return {
        label: 'Pull Request Review',
        subjectType,
      }
    }

    case 'RepositoryInvitation': {
      return {
        label: 'Invitation',
        subjectType,
      }
    }

    case 'RepositoryVulnerabilityAlert': {
      return {
        color: 'red',
        label: 'Security',
        subjectType,
      }
    }

    default: {
      return {
        label: _.startCase(subjectType),
        subjectType,
      }
    }
  }
}

export function getItemSubjectType(
  type: ColumnSubscription['type'],
  item: EnhancedItem | undefined,
): GitHubItemSubjectType | undefined {
  switch (type) {
    case 'activity':
      return (
        getEventMetadata(item as EnhancedGitHubEvent).subjectType || undefined
      )

    case 'issue_or_pr':
      return (
        getIssueOrPullRequestSubjectType(
          item as EnhancedGitHubIssueOrPullRequest,
        ) || undefined
      )

    case 'notifications':
      return (
        getNotificationSubjectType(item as EnhancedGitHubNotification) ||
        undefined
      )

    default:
      return undefined
  }
}

export function getItemPrivacy(
  type: ColumnSubscription['type'],
  item: EnhancedItem | undefined,
): GitHubPrivacy | undefined {
  if (!item) return undefined

  switch (type) {
    case 'activity':
      return isEventPrivate(item as EnhancedGitHubEvent) ? 'private' : 'public'

    case 'issue_or_pr':
      return undefined // TODO

    case 'notifications':
      return isNotificationPrivate(item as EnhancedGitHubNotification)
        ? 'private'
        : 'public'

    default:
      return undefined
  }
}

export function getItemIssueOrPullRequest(
  type: ColumnSubscription['type'],
  item: EnhancedItem | undefined,
): GitHubIssueOrPullRequest | undefined {
  if (!item) return undefined

  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent

      return (
        event &&
        event.payload &&
        ('issue' in event.payload
          ? event.payload.issue
          : 'pull_request' in event.payload
          ? event.payload.pull_request
          : undefined)
      )
    }

    case 'issue_or_pr': {
      const issueOrPR = item as EnhancedGitHubIssueOrPullRequest
      const subjectType = getIssueOrPullRequestSubjectType(issueOrPR)

      return subjectType === 'Issue'
        ? (issueOrPR as EnhancedGitHubIssue)
        : subjectType === 'PullRequest'
        ? (issueOrPR as EnhancedGitHubPullRequest)
        : undefined
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification
      const subjectType = getNotificationSubjectType(notification)

      return subjectType === 'Issue' || subjectType === 'PullRequest'
        ? (notification.issue as EnhancedGitHubIssue) ||
            (notification.pullRequest as EnhancedGitHubPullRequest)
        : undefined
    }

    default:
      return undefined
  }
}

export function getItemOwnersAndRepos(
  type: ColumnSubscription['type'],
  item: EnhancedItem | undefined,
): Array<{ owner: string; repo: string }> {
  const mapResult: Record<string, any> = {}

  function mapToResult(map: Record<string, any>) {
    return Object.keys(map)
      .map(repoFullName => getOwnerAndRepo(repoFullName))
      .filter(or => !!(or.owner && or.repo)) as Array<{
      owner: string
      repo: string
    }>
  }

  function addOwnerAndRepo(
    owner: string | undefined,
    repo: string | undefined,
  ) {
    const _owner = `${owner || ''}`.toLowerCase().trim()
    const _repo = `${repo || ''}`.toLowerCase().trim()
    if (!(_owner && _repo)) return -1

    const repoFullName = `${_owner}/${_repo}`

    if (repoFullName in mapResult) return 0

    mapResult[repoFullName] = true
    return 1
  }

  if (!item) return []

  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent
      const { repo: _repo } = event as GitHubEvent
      const { repos: _repos } = event as MultipleStarEvent
      const { commits: _commits } = event.payload as GitHubPushEvent['payload']
      const commits: GitHubPushedCommit[] = (_commits || []).filter(Boolean)

      const _allRepos: GitHubRepo[] = (_repos || [_repo]).filter(r => {
        if (!(r && r.name)) return false

        const { owner, repo } = getOwnerAndRepo(r.name)
        if (addOwnerAndRepo(owner, repo) === 1) return true
        return false
      })

      // ugly and super edge case workaround for repo not being returned on some commit events
      if (!_allRepos.length && commits[0]) {
        const _repoFullName = getRepoFullNameFromUrl(commits[0].url)
        const { owner, repo } = getOwnerAndRepo(_repoFullName)
        addOwnerAndRepo(owner, repo)
      }

      return mapToResult(mapResult)
    }

    case 'issue_or_pr': {
      const issueOrPR = item as EnhancedGitHubIssueOrPullRequest

      const repoFullName = getRepoFullNameFromUrl(
        issueOrPR.repository_url || issueOrPR.url || issueOrPR.html_url,
      )
      const { owner, repo } = getOwnerAndRepo(repoFullName)
      addOwnerAndRepo(owner, repo)

      return mapToResult(mapResult)
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification

      const repoFullName =
        (notification &&
          (notification.repository.full_name ||
            notification.repository.name)) ||
        ''

      const { owner, repo } = getOwnerAndRepo(repoFullName)
      addOwnerAndRepo(owner, repo)

      return mapToResult(mapResult)
    }

    default:
      return []
  }
}

export function getFilteredItems(
  type: ColumnSubscription['type'] | undefined,
  items: EnhancedItem[],
  filters: ColumnFilters | undefined,
  mergeSimilar: boolean,
) {
  if (type === 'activity') {
    return getFilteredEvents(
      items as EnhancedGitHubEvent[],
      filters,
      mergeSimilar,
    )
  }

  if (type === 'issue_or_pr') {
    return getFilteredIssueOrPullRequests(
      items as EnhancedGitHubIssueOrPullRequest[],
      filters,
    )
  }

  if (type === 'notifications') {
    return getFilteredNotifications(
      items as EnhancedGitHubNotification[],
      filters,
    )
  }

  console.error(`Not filtered. Unhandled subscription type: ${type}`)
  return items
}

const _defaultItemFilterCountMetadata: ItemFilterCountMetadata = {
  read: 0,
  unread: 0,
  saved: 0,
  total: 0,
}

function getDefaultItemFilterCountMetadata() {
  return _.cloneDeep(_defaultItemFilterCountMetadata)
}

const _defaultItemsFilterMetadata: ItemsFilterMetadata = {
  inbox: {
    all: getDefaultItemFilterCountMetadata(),
    participating: getDefaultItemFilterCountMetadata(),
  },
  saved: getDefaultItemFilterCountMetadata(),
  state: {
    open: getDefaultItemFilterCountMetadata(),
    closed: getDefaultItemFilterCountMetadata(),
    merged: getDefaultItemFilterCountMetadata(),
  },
  draft: getDefaultItemFilterCountMetadata(),
  // involves: {},
  subjectType: {}, // { issue: getDefaultItemFilterCountMetadata(), ... }
  subscriptionReason: {}, // { mentioned: getDefaultItemFilterCountMetadata(), ... }
  eventAction: {}, // { starred: getDefaultItemFilterCountMetadata(), ... }
  privacy: {
    public: getDefaultItemFilterCountMetadata(),
    private: getDefaultItemFilterCountMetadata(),
  },
  owners: {},
}

function getDefaultItemsFilterMetadata() {
  return _.cloneDeep(_defaultItemsFilterMetadata)
}

export function getItemsFilterMetadata(
  type: ColumnSubscription['type'],
  items: EnhancedItem[],
): ItemsFilterMetadata {
  const result: ItemsFilterMetadata = getDefaultItemsFilterMetadata()
  if (!(items && items.length > 0)) return result

  items.filter(Boolean).forEach(item => {
    const event =
      type === 'activity' ? (item as EnhancedGitHubEvent) : undefined
    const notification =
      type === 'notifications'
        ? (item as EnhancedGitHubNotification)
        : undefined

    const issueOrPR = getItemIssueOrPullRequest(type, item)

    const read = isItemRead(item)
    const saved = !!item.saved
    const subjectType = getItemSubjectType(type, item)
    const subscriptionReason = notification && notification.reason
    const eventAction = event && getEventMetadata(event).action
    const privacy = getItemPrivacy(type, item)

    const ownersAndrepos = getItemOwnersAndRepos(type, item)

    function updateNestedCounter(objRef: ItemFilterCountMetadata) {
      if (read) objRef.read++
      if (!read) objRef.unread++
      if (saved) objRef.saved++
      objRef.total++
    }

    const inbox =
      notification && notification.reason !== 'subscribed'
        ? 'participating'
        : 'all'
    updateNestedCounter(result.inbox[inbox])
    if (inbox !== 'all') updateNestedCounter(result.inbox.all)

    if (saved) updateNestedCounter(result.saved)

    const state = getIssueOrPullRequestState(issueOrPR)
    if (state) updateNestedCounter(result.state[state])

    if (isDraft(issueOrPR)) updateNestedCounter(result.draft)

    if (subjectType) {
      if (!result.subjectType[subjectType])
        result.subjectType[subjectType] = getDefaultItemFilterCountMetadata()
      updateNestedCounter(result.subjectType[subjectType]!)
    }

    if (subscriptionReason) {
      if (!result.subscriptionReason[subscriptionReason])
        result.subscriptionReason[
          subscriptionReason
        ] = getDefaultItemFilterCountMetadata()
      updateNestedCounter(result.subscriptionReason[subscriptionReason]!)
    }

    if (eventAction) {
      result.eventAction[eventAction] =
        result.eventAction[eventAction] || getDefaultItemFilterCountMetadata()
      updateNestedCounter(result.eventAction[eventAction]!)
    }

    if (privacy) {
      if (!result.privacy[privacy])
        result.privacy[privacy] = getDefaultItemFilterCountMetadata()
      updateNestedCounter(result.privacy[privacy]!)
    }

    if (ownersAndrepos && ownersAndrepos.length) {
      ownersAndrepos.forEach(or => {
        if (or.owner) {
          result.owners[or.owner] = result.owners[or.owner] || {
            metadata: getDefaultItemFilterCountMetadata(),
            repos: {},
          }

          updateNestedCounter(result.owners[or.owner]!.metadata!)

          if (or.repo) {
            result.owners[or.owner].repos![or.repo] =
              result.owners[or.owner].repos![or.repo] ||
              getDefaultItemFilterCountMetadata()
            updateNestedCounter(result.owners[or.owner].repos![or.repo]!)
          }
        }
      })
    }
  })

  return result
}
