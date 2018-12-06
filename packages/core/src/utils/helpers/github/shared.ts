import gravatar from 'gravatar'

import {
  ColumnSubscription,
  GitHubIcon,
  GitHubPullRequest,
  Omit,
} from '../../../types'
import { getSteppedSize } from '../shared'

export function getUserAvatarByAvatarURL(
  avatarURL: string,
  { size }: { size?: number } = {},
  getPixelSizeForLayoutSizeFn?: (size: number) => number,
) {
  if (!avatarURL) return ''

  const _avatarURL = avatarURL.indexOf('?') > 0 ? avatarURL : `${avatarURL}?`
  return `${_avatarURL}&s=${getSteppedSize(
    size,
    undefined,
    getPixelSizeForLayoutSizeFn,
  )}`
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
    return emailSplit[0].split('+').pop()

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

export function getCommitIconAndColor(): { icon: GitHubIcon; color?: string } {
  return { icon: 'git-commit' }
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
  subscription: Pick<ColumnSubscription, 'type' | 'subtype' | 'params'>,
) {
  return {
    ...subscription,
    id: getUniqueIdForSubscription(subscription as any),
  }
}
