import {
  GitHubIcon,
  GitHubNotification,
  GitHubPullRequest,
} from '@devhub/core/dist/types'
import {
  getCommitIconAndColor,
  isPullRequest,
} from '@devhub/core/dist/utils/helpers/github/shared'
import * as colors from '../../../styles/colors'

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
    case 'Issue':
      return getIssueIconAndColor({})
    case 'PullRequest':
      return getPullRequestIconAndColor({})
    case 'Release':
      return { icon: 'tag' }
    case 'RepositoryInvitation':
      return { icon: 'mail' }
    case 'RepositoryVulnerabilityAlert':
      return { icon: 'alert', color: colors.yellow }
    default: {
      console.error('Unknown notification type', type)
      return { icon: 'bell' }
    }
  }
}
