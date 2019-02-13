import {
  getCommitIconAndColor,
  GitHubIcon,
  GitHubIssue,
  GitHubNotification,
  GitHubPullRequest,
  isPullRequest,
} from '@devhub/core'
import { bugsnag } from '../../../libs/bugsnag'
import * as colors from '../../../styles/colors'

export function getPullRequestIconAndColor(pullRequest: {
  draft: GitHubPullRequest['draft']
  state: GitHubPullRequest['state']
  merged_at: GitHubPullRequest['merged_at'] | undefined
}): { icon: GitHubIcon; color?: string } {
  const draft = pullRequest.draft
  const merged = pullRequest.merged_at
  const state = merged ? 'merged' : pullRequest.state

  switch (state) {
    case 'open':
      return {
        icon: 'git-pull-request',
        color: draft ? colors.gray : colors.green,
      }

    case 'closed':
      return { icon: 'git-pull-request', color: colors.red }

    case 'merged':
      return { icon: 'git-merge', color: colors.purple }

    default:
      return { icon: 'git-pull-request' }
  }
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
  payload?: GitHubIssue | GitHubPullRequest | undefined,
): { icon: GitHubIcon; color?: string } {
  const { subject } = notification
  const { type } = subject

  switch (type) {
    case 'Commit':
      return getCommitIconAndColor()
    case 'Issue':
      return getIssueIconAndColor(payload as GitHubIssue)
    case 'PullRequest':
      return getPullRequestIconAndColor(payload as GitHubPullRequest)
    case 'Release':
      return { icon: 'tag' }
    case 'RepositoryInvitation':
      return { icon: 'mail' }
    case 'RepositoryVulnerabilityAlert':
      return { icon: 'alert', color: colors.yellow }
    default: {
      const message = `Unknown event type: ${(event as any).type}`
      bugsnag.notify(new Error(message))
      console.error(message)
      return { icon: 'bell' }
    }
  }
}

export function normalizeUsername(username: string | undefined) {
  if (!username || typeof username !== 'string') return undefined
  return username.trim().toLowerCase()
}
