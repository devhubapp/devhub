// @flow
/* eslint-disable import/prefer-default-export */

import { PixelRatio } from 'react-native'

import gravatar from 'gravatar'

import * as baseTheme from '../../../styles/themes/base'
import { get } from '../../immutable'

import type {
  GithubIcon,
  GithubIssue,
  GithubPullRequest,
  ThemeObject,
} from '../../types'

export function getSteppedSize(size, sizeSteps = 50) {
  // sizes will be multiples of 50 for caching (e.g 50, 100, 150, ...)
  const steppedSize =
    typeof size !== 'number'
      ? sizeSteps
      : sizeSteps * Math.max(1, Math.ceil(size / sizeSteps))

  return PixelRatio.getPixelSizeForLayoutSize(steppedSize)
}

export function isPullRequest(issue: GithubIssue | GithubPullRequest) {
  return (
    issue &&
    (get(issue, 'pull_request') ||
      get(issue, 'merged_at') ||
      (get(issue, 'html_url') && get(issue, 'html_url').indexOf('pull') >= 0) ||
      (get(issue, 'url') && get(issue, 'url').indexOf('pull') >= 0))
  )
}

export function getPullRequestIconAndColor(
  pullRequest: GithubPullRequest,
  theme?: ThemeObject = baseTheme,
): { icon: GithubIcon, color?: string } {
  const merged = get(pullRequest, 'merged_at')
  const state = merged ? 'merged' : get(pullRequest, 'state')

  switch (state) {
    case 'open':
      return { icon: 'git-pull-request', color: theme.green }

    case 'closed':
      return { icon: 'git-pull-request', color: theme.red }

    case 'merged':
      return { icon: 'git-merge', color: theme.purple }

    default:
      return { icon: 'git-pull-request' }
  }
}

export function getIssueIconAndColor(
  issue: GithubIssue,
  theme?: ThemeObject = baseTheme,
): { icon: GithubIcon, color?: string } {
  const state = get(issue, 'state')

  if (isPullRequest(issue)) {
    return getPullRequestIconAndColor(issue, theme)
  }

  switch (state) {
    case 'open':
      return { icon: 'issue-opened', color: theme.green }

    case 'closed':
      return { icon: 'issue-closed', color: theme.red }

    default:
      return { icon: 'issue-opened' }
  }
}

export function getOwnerAndRepo(
  repoFullName: string,
): { owner: ?string, repo: ?string } {
  const repoSplitedNames = (repoFullName || '')
    .trim()
    .split('/')
    .filter(Boolean)

  const owner = (repoSplitedNames[0] || '').trim()
  const repo = (repoSplitedNames[1] || '').trim()

  return { owner, repo }
}

export function getOrgAvatar(orgName: string) {
  return orgName ? `https://github.com/${orgName}.png` : ''
}

export function getUserAvatarByUsername(userName: string, size?: number) {
  return userName
    ? `https://github.com/${userName}.png?size=${getSteppedSize(size)}`
    : ''
}

export function tryGetUsernameFromGithubEmail(email: string) {
  if (!email) return ''

  const emailSplit = email.split('@')
  if (emailSplit.length === 2 && emailSplit[1] === 'users.noreply.github.com')
    return emailSplit[0]

  return ''
}

export function getUserAvatarByEmail(
  email: string,
  { size, ...otherOptions }: { size?: number },
) {
  const steppedSize = getSteppedSize(size)
  const username = tryGetUsernameFromGithubEmail(email)
  if (username) return getUserAvatarByUsername(username, steppedSize)

  const options = { size: steppedSize, d: 'retro', ...otherOptions }
  return `https:${gravatar.url(email, options)}`.replace('??', '?')
}
