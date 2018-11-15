import gravatar from 'gravatar'

import * as colors from '../../../styles/colors'
import {
  ColumnSubscription,
  GitHubIcon,
  GitHubNotification,
  GitHubPullRequest,
  Omit,
} from '../../../types'
import { getSteppedSize } from '../shared'

export function getUserAvatarByAvatarURL(
  avatarURL: string,
  { size }: { size?: number } = {},
) {
  if (!avatarURL) return ''

  const _avatarURL = avatarURL.indexOf('?') > 0 ? avatarURL : `${avatarURL}?`
  return `${_avatarURL}&s=${getSteppedSize(size)}`
}

export function getUserAvatarByUsername(
  username: string,
  { size }: { size?: number } = {},
) {
  return username
    ? `https://github.com/${username}.png?size=${getSteppedSize(size)}`
    : ''
}

export function tryGetUsernameFromGitHubEmail(email?: string) {
  if (!email) return ''

  const emailSplit = email.split('@')
  if (emailSplit.length === 2 && emailSplit[1] === 'users.noreply.github.com')
    return emailSplit[0].split('+').pop()

  return ''
}

export function getUserAvatarByEmail(
  email: string,
  { size, ...otherOptions }: { size?: number } = {},
) {
  const steppedSize = getSteppedSize(size)
  const username = tryGetUsernameFromGitHubEmail(email)
  if (username) return getUserAvatarByUsername(username, { size: steppedSize })

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

export function getPullRequestIconAndColor(pullRequest: {
  state?: GitHubPullRequest['state']
  merged_at?: GitHubPullRequest['merged_at']
}): { icon: GitHubIcon; color?: string } {
  const merged = pullRequest.merged_at
  const state = merged ? 'merged' : pullRequest.state

  switch (state) {
    case 'open':
      return { icon: 'git-pull-request', color: colors.green }

    case 'closed':
      return { icon: 'git-pull-request', color: colors.red }

    case 'merged':
      return { icon: 'git-merge', color: colors.purple }

    default:
      return { icon: 'git-pull-request' }
  }
}

export function getCommitIconAndColor(): { icon: GitHubIcon; color?: string } {
  return { icon: 'git-commit' }
}

export function getIssueIconAndColor(issue: {
  state?: GitHubPullRequest['state']
  merged_at?: GitHubPullRequest['merged_at']
}): { icon: GitHubIcon; color?: string } {
  const { state } = issue

  if (isPullRequest(issue)) {
    return getPullRequestIconAndColor(issue as GitHubPullRequest)
  }

  switch (state) {
    case 'open':
      return { icon: 'issue-opened', color: colors.green }

    case 'closed':
      return { icon: 'issue-closed', color: colors.red }

    default:
      return { icon: 'issue-opened' }
  }
}

export function getNotificationIconAndColor(
  notification: GitHubNotification,
  // payload: GitHubCommit | GitHubIssue | GitHubPullRequest,
): { icon: GitHubIcon; color?: string } {
  const { subject } = notification
  const { type } = subject

  switch (type) {
    case 'Commit':
      return getCommitIconAndColor()
    case 'RepositoryInvitation':
      return { icon: 'mail' }
    case 'Issue':
      return getIssueIconAndColor({})
    case 'PullRequest':
      return getPullRequestIconAndColor({})
    case 'Release':
      return { icon: 'tag' }
    default: {
      console.error('Unknown notification type', type)
      return { icon: 'bell' }
    }
  }
}

export function getUniqueIdForSubscription(subscription: ColumnSubscription) {
  switch (subscription.type) {
    case 'activity': {
      switch (subscription.subtype) {
        case 'PUBLIC_EVENTS': {
          return '/events'
        }

        case 'REPO_EVENTS': {
          const { owner, repo } = subscription.params
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/repos/${owner}/${repo}/events`
        }

        case 'REPO_NETWORK_EVENTS': {
          const { owner, repo } = subscription.params
          if (!(owner && repo)) throw new Error('Required params: owner, repo')
          return `/networks/${owner}/${repo}/events`
        }

        case 'ORG_PUBLIC_EVENTS': {
          const { org } = subscription.params
          if (!org) throw new Error('Required params: org')
          return `/orgs/${org}/events`
        }

        case 'USER_RECEIVED_EVENTS': {
          const { username } = subscription.params
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/received_events`
        }

        case 'USER_RECEIVED_PUBLIC_EVENTS': {
          const { username } = subscription.params
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/received_events/public`
        }

        case 'USER_EVENTS': {
          const { username } = subscription.params
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/events`
        }

        case 'USER_PUBLIC_EVENTS': {
          const { username } = subscription.params
          if (!username) throw new Error('Required params: username')
          return `/users/${username}/events/public`
        }

        case 'USER_ORG_EVENTS': {
          const { org, username } = subscription.params
          if (!(username && org))
            throw new Error('Required params: username, org')
          return `/users/${username}/events/orgs/${org}`
        }

        default: {
          throw new Error(
            `No path configured for subscription type '${
              (subscription as any).subtype
            }'`,
          )
        }
      }
    }

    case 'notifications': {
      return `/notifications?all=${subscription.params!.all ? 'true' : 'false'}`
    }

    default:
      throw new Error(
        `Unknown subscription type: ${(subscription as any).type}`,
      )
  }
}

export function createSubscriptionObjectWithId(
  subscription: Omit<ColumnSubscription, 'id' | 'createdAt' | 'updatedAt'>,
) {
  return {
    ...subscription,
    id: getUniqueIdForSubscription(subscription as any),
  }
}
