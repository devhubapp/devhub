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
  GitHubComment,
  GitHubIcon,
  GitHubIssueOrPullRequest,
  GitHubItemSubjectType,
  GitHubPrivacy,
  GitHubPullRequest,
  GitHubRelease,
  GitHubRepo,
  GitHubStateType,
  IssueOrPullRequestColumnSubscription,
  ItemFilterCountMetadata,
  ItemsFilterMetadata,
  NotificationColumnSubscription,
  ThemeColors,
} from '../../types'
import { constants } from '../../utils'
import {
  getFilteredEvents,
  getFilteredIssueOrPullRequests,
  getFilteredNotifications,
  getOwnerAndRepoFormattedFilter,
} from '../filters'
import {
  getSteppedSize,
  isEventPrivate,
  isNotificationPrivate,
} from '../shared'
import { getEventMetadata, getGitHubEventSubItems } from './events'
import {
  getGitHubIssueSearchQuery,
  getIssueOrPullRequestState,
  getIssueOrPullRequestSubjectType,
} from './issues'
import {
  getGitHubNotificationSubItems,
  getNotificationSubjectType,
} from './notifications'
import {
  getBaseUrlFromOtherUrl,
  getCommitShaFromUrl,
  getRepoFullNameFromUrl,
} from './url'

const GITHUB_USERNAME_REGEX_PATTERN =
  '[a-zA-Z\\d](?:[a-zA-Z\\d]|-(?=[a-zA-Z\\d])){0,38}'
export const GITHUB_USERNAME_REGEX = new RegExp(
  `^${GITHUB_USERNAME_REGEX_PATTERN}$`,
  '',
)

const GITHUB_REPO_NAME_REGEX_PATTERN = '[a-zA-Z\\d._-]+'
export const GITHUB_REPO_NAME_REGEX = new RegExp(
  `^${GITHUB_REPO_NAME_REGEX_PATTERN}$`,
  '',
)

const GITHUB_REPO_FULL_NAME_FORMAT_REGEX_PATTERN = '([^/]+)\\/([^/]+)'
export const GITHUB_REPO_FULL_NAME_FORMAT_REGEX = new RegExp(
  `^${GITHUB_REPO_FULL_NAME_FORMAT_REGEX_PATTERN}$`,
  '',
)

const GITHUB_REPO_FULL_NAME_REGEX_PATTERN = `(${GITHUB_USERNAME_REGEX_PATTERN})\\/(${GITHUB_REPO_NAME_REGEX_PATTERN})`
export const GITHUB_REPO_FULL_NAME_REGEX = new RegExp(
  `^${GITHUB_REPO_FULL_NAME_REGEX_PATTERN}$`,
  '',
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

export function getUserURLFromObject(user: {
  login: string
  avatar_url: string
  url?: string
  html_url?: string
}): string | undefined {
  if (user.html_url) return user.html_url
  if (!user.login) return undefined

  const _baseURL = getBaseUrlFromOtherUrl(user.url) || 'https://github.com'
  return `${_baseURL}/${user.login}`
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
  { baseURL, size }: { baseURL: string | undefined; size?: number },
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  return username
    ? `${baseURL || 'https://github.com/'}${username}.png?size=${getSteppedSize(
        size,
        undefined,
        getPixelSizeForLayoutSizeFn,
      )}`
    : ''
}

export function getUserAvatarFromObject(
  user: { login: string; avatar_url: string; url?: string; html_url?: string },
  { size }: { size?: number } = {},
) {
  if (user.avatar_url) return user.avatar_url
  if (!user.login) return undefined

  return getUserAvatarByUsername(user.login, {
    baseURL: getBaseUrlFromOtherUrl(user.html_url || user.url),
    size,
  })
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
  {
    baseURL,
    size,
    ...otherOptions
  }: { baseURL: string | undefined; size?: number },
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
      { baseURL, size: steppedSize },
      getPixelSizeForLayoutSizeFn,
    )

  const options = { size: `${steppedSize || ''}`, d: 'retro', ...otherOptions }
  return `https:${gravatar.url(email, options)}`.replace('??', '?')
}

export function isPullRequest(issue: {
  pull_request?: object
  merged_at?: GitHubPullRequest['merged_at']
  html_url: GitHubPullRequest['html_url']
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
  repoFullName: string | undefined,
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
      ownerIsKnown: boolean
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
            ownerIsKnown: true,
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.org,
          }
        }
        case 'PUBLIC_EVENTS': {
          return {
            icon: 'rss',
            ownerIsKnown: false,
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
            ownerIsKnown: true,
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
            ownerIsKnown: false,
            repoIsKnown: false,
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
            ownerIsKnown: false,
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.username,
          }
        }
        case 'USER_ORG_EVENTS': {
          return {
            avatarProps: { username: s.params!.org },
            icon: 'organization',
            ownerIsKnown: true,
            repoIsKnown: false,
            subtitle: 'Activity',
            title: s.params!.org,
          }
        }
        case 'USER_PUBLIC_EVENTS': {
          return {
            avatarProps: { username: s.params!.username },
            icon: 'person',
            ownerIsKnown: false,
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
            ownerIsKnown: false,
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
            ownerIsKnown: false,
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

      const {
        allIncludedOwners,
        allIncludedRepos,
      } = getOwnerAndRepoFormattedFilter(column.filters)

      const owner =
        allIncludedOwners.length === 1 ? allIncludedOwners[0] : undefined

      const ownerAndRepo =
        allIncludedRepos.length === 1
          ? getOwnerAndRepo(allIncludedRepos[0])
          : { owner: undefined, repo: undefined }

      let suffix = ''

      const involving =
        s.params && s.params.involves
          ? Object.keys(s.params.involves).filter(
              user =>
                !!s.params &&
                s.params.involves &&
                s.params.involves[user] === true,
            )
          : []
      if (involving.length)
        suffix += `${suffix ? ', ' : ''} involving ${involving.join(', ')}`

      const notInvolving =
        s.params && s.params.involves
          ? Object.keys(s.params.involves).filter(
              user =>
                !!s.params &&
                s.params.involves &&
                s.params.involves[user] === false,
            )
          : []
      if (notInvolving.length)
        suffix += `${suffix ? ', ' : ''} not involving ${notInvolving.join(
          ', ',
        )}`

      const usernames =
        (ownerAndRepo.repo && ownerAndRepo.owner
          ? [ownerAndRepo.owner]
          : undefined) ||
        (owner ? [owner] : undefined) ||
        (involving && involving.length ? involving : undefined) ||
        (notInvolving && notInvolving.length ? notInvolving : undefined) ||
        (allIncludedOwners && allIncludedOwners.length
          ? allIncludedOwners
          : undefined) ||
        []

      const avatarProps = {
        repo: ownerAndRepo.repo,
        username:
          (ownerAndRepo.repo && ownerAndRepo.owner) ||
          owner ||
          usernames[0] ||
          '',
      }

      switch (s && s.subtype) {
        case 'ISSUES':
        case 'PULLS':
        default: {
          return {
            avatarProps,
            ownerIsKnown: !!owner,
            repoIsKnown: !!(ownerAndRepo.owner && ownerAndRepo.repo),
            owner: ownerAndRepo.owner || owner || '',
            repo: ownerAndRepo.repo || '',
            title:
              ownerAndRepo.repo ||
              (ownerAndRepo.repo && ownerAndRepo.owner) ||
              usernames.join(',') ||
              '',
            ...(s.subtype === 'ISSUES'
              ? {
                  icon: 'issue-opened',
                  subtitle: `Issues${suffix}`,
                }
              : s.subtype === 'PULLS'
              ? {
                  icon: 'git-pull-request',
                  subtitle: `Pull Requests${suffix}`,
                }
              : {
                  icon: 'issue-opened',
                  subtitle: `Issues & PRs${suffix}`,
                }),
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
            ownerIsKnown: true,
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
            ownerIsKnown: false,
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
        ownerIsKnown: false,
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

export function getNameFromRef(ref: string | undefined) {
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
  html_url: GitHubPullRequest['html_url']
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
  { includeFork }: { includeFork?: boolean } = {},
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

  if (!item) return constants.EMPTY_ARRAY

  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent
      const { repos, forkee } = getGitHubEventSubItems(event)

      const _allRepos: GitHubRepo[] = [
        ...(repos || []),
        ...(includeFork && forkee ? [forkee] : []),
      ]

      _allRepos.forEach(r => {
        if (!(r && r.name)) return false

        const { owner, repo } = getOwnerAndRepo(r.name)
        if (addOwnerAndRepo(owner, repo) === 1) return true
        return false
      })

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
      return constants.EMPTY_ARRAY
  }
}

export function getItemIsBot(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
): boolean {
  if (!item) return false

  switch (type) {
    case 'activity': {
      const event = item as EnhancedGitHubEvent
      const { actor } = event
      return !!(actor && actor.login && actor.login.indexOf('[bot]') >= 0)
    }

    case 'issue_or_pr': {
      const issueOrPR = item as EnhancedGitHubIssueOrPullRequest
      const { user } = issueOrPR

      return !!(user && user.login && user.login.indexOf('[bot]') >= 0)
    }

    case 'notifications': {
      const notification = item as EnhancedGitHubNotification
      const { comment, commit, release, issue, pullRequest } = notification

      const actor =
        (comment && comment.user) ||
        (commit && commit.author) ||
        (release && release.author) ||
        (issue && issue.user) ||
        (pullRequest && pullRequest.user) ||
        null

      return (
        !!(actor && actor.login && actor.login.indexOf('[bot]') >= 0) ||
        notification.reason === 'security_alert'
      )
    }

    default:
      return false
  }
}

export function getFilteredItems(
  type: ColumnSubscription['type'] | undefined,
  items: EnhancedItem[],
  filters: ColumnFilters | undefined,
  {
    mergeSimilar,
  }: {
    mergeSimilar: boolean
  },
) {
  if (type === 'activity') {
    return getFilteredEvents(items as EnhancedGitHubEvent[], filters, {
      mergeSimilar,
    })
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
  bot: getDefaultItemFilterCountMetadata(),
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
  {
    forceIncludeTheseOwners = [],
    forceIncludeTheseRepos = [],
  }: {
    forceIncludeTheseOwners?: string[]
    forceIncludeTheseRepos?: string[]
  } = {},
): ItemsFilterMetadata {
  const result: ItemsFilterMetadata = getDefaultItemsFilterMetadata()
  ;(items || []).filter(Boolean).forEach(item => {
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

    const ownersAndRepos = getItemOwnersAndRepos(type, item)

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

    if (getItemIsBot(type, item)) updateNestedCounter(result.bot)

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

    if (ownersAndRepos && ownersAndRepos.length) {
      ownersAndRepos.forEach(or => {
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

  if (forceIncludeTheseOwners && forceIncludeTheseOwners.length) {
    forceIncludeTheseOwners.forEach(owner => {
      result.owners[owner] = result.owners[owner] || {
        metadata: getDefaultItemFilterCountMetadata(),
        repos: {},
      }
    })
  }

  if (forceIncludeTheseRepos && forceIncludeTheseRepos.length) {
    forceIncludeTheseRepos.forEach(repoFullName => {
      const { owner, repo } = getOwnerAndRepo(repoFullName)
      if (!(owner && repo)) return

      result.owners[owner] = result.owners[owner] || {
        metadata: getDefaultItemFilterCountMetadata(),
        repos: {},
      }

      result.owners[owner]!.repos = result.owners[owner]!.repos || {}

      result.owners[owner]!.repos[repo] =
        result.owners[owner]!.repos[repo] || getDefaultItemFilterCountMetadata()
    })
  }

  return result
}

export function getItemSearchableStrings(
  type: ColumnSubscription['type'],
  item: EnhancedItem,
): string[] {
  const strings: string[] = []

  const event = type === 'activity' ? (item as EnhancedGitHubEvent) : undefined
  const notification =
    type === 'notifications' ? (item as EnhancedGitHubNotification) : undefined
  const issueOrPullRequest = getItemIssueOrPullRequest(type, item)

  let comment: GitHubComment | undefined
  let release: Partial<GitHubRelease> | undefined

  const id = item.id

  const ownersAndRepos = getItemOwnersAndRepos(type, item)

  strings.push(`${id || ''}`)

  if (ownersAndRepos && ownersAndRepos.length) {
    ownersAndRepos.forEach(ownersAndRepo => {
      strings.push(`${ownersAndRepo.owner}/${ownersAndRepo.repo}`)
    })
  }

  if (issueOrPullRequest) {
    strings.push(`${issueOrPullRequest.body || ''}`)
    strings.push(`${issueOrPullRequest.created_at || ''}`)
    strings.push(
      `${(issueOrPullRequest.id && `#${issueOrPullRequest.id}`) || ''}`,
    )
    if (issueOrPullRequest.labels && issueOrPullRequest.labels.length) {
      issueOrPullRequest.labels.forEach(labelDetails => {
        const label = labelDetails && `${labelDetails.name || ''}`
        if (!label) return

        strings.push(`label:${label}`)
      })
    }
    strings.push(`${issueOrPullRequest.title || ''}`)
    strings.push(`${issueOrPullRequest.updated_at || ''}`)
    strings.push(
      `${(issueOrPullRequest.user && issueOrPullRequest.user.login) || ''}`,
    )
  }

  if (event) {
    const {
      actor,
      // avatarUrl,
      branchOrTagName,
      comment: _comment,
      // commitShas,
      commits,
      createdAt,
      forkRepoFullName,
      // forkee,
      // id,
      // isBot,
      // isBranchMainEvent,
      // isForcePush,
      // isPrivate,
      // isPush,
      // isRead,
      // isSaved,
      // isTagMainEvent,
      // issueOrPullRequest,
      // issueOrPullRequestNumber,
      mergedIds,
      // pageShas,
      pages,
      release: _release,
      // repoIds,
      // repoFullName,
      // repos,
      // userIds,
      users,
    } = getGitHubEventSubItems(event)

    comment = _comment
    release = _release

    strings.push(`${(actor && actor.login) || ''}`)
    if (branchOrTagName) strings.push(branchOrTagName)
    if (commits) {
      commits.forEach(commit => {
        if (!commit) return

        const authorEmail = `${(commit.author && commit.author.email) || ''}`
        const authorName = `${(commit.author && commit.author.name) || ''}`
        const message = `${commit.message || ''}`
        const sha = `${commit.sha || ''}`

        if (authorEmail) strings.push(authorEmail)
        if (authorName) strings.push(authorName)
        if (message) strings.push(message)
        if (sha) strings.push(sha)
      })
    }
    strings.push(createdAt)
    if (forkRepoFullName) strings.push(forkRepoFullName)
    if (mergedIds && mergedIds.length) {
      mergedIds.forEach(mergedId => {
        strings.push(mergedId)
      })
    }
    if (pages && pages.length) {
      pages.forEach(page => {
        strings.push(page.page_name)
        strings.push(page.sha)
        strings.push(page.title)
      })
    }
    if (users && users.length) {
      users.forEach(user => {
        strings.push(user.login)
      })
    }
  } else if (notification) {
    const {
      comment: _comment,
      commit,
      createdAt,
      // id,
      // isBot,
      // isPrivate,
      // isPrivateAndCantSee,
      // isRead,
      // isRepoInvitation,
      // isSaved,
      // isVulnerabilityAlert,
      // issueOrPullRequest,
      // issueOrPullRequestNumber,
      release: _release,
      // repo,
      // repoFullName,
      subject,
      updatedAt,
    } = getGitHubNotificationSubItems(notification)

    comment = _comment
    release = _release as any // TODO: Fix type error

    if (commit) {
      const author = commit.commit && commit.commit.author

      const authorLogin = `${(commit.author && commit.author.login) || ''}`
      const authorEmail = `${(author && author.email) || ''}`
      const authorName = `${(author && author.name) || ''}`
      const message = `${(commit.commit && commit.commit.message) || ''}`
      const sha = `${getCommitShaFromUrl(
        (commit.commit && commit.commit.url) || commit.url,
      ) || ''}`

      if (authorLogin) strings.push(authorLogin)
      if (authorEmail) strings.push(authorEmail)
      if (authorName) strings.push(authorName)
      if (message) strings.push(message)
      if (sha) strings.push(sha)
    }

    strings.push(`${createdAt || ''}`)
    strings.push(`${subject.title || ''}`)
    strings.push(`${updatedAt || ''}`)
  } else {
    //
  }

  if (comment) {
    strings.push(`${(comment.user && comment.user.login) || ''}`)
    strings.push(`${comment.body || ''}`)
  }

  if (release) {
    strings.push(`${(release.author && release.author.login) || ''}`)
    strings.push(`${release.body || ''}`)
    strings.push(`${release.id || ''}`)
    strings.push(`${release.name || ''}`)
    strings.push(`${release.published_at || ''}`)
    strings.push(`${release.tag_name || ''}`)
  }

  return strings.map(str => `${str || ''}`).filter(Boolean)
}
