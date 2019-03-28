import { GitHubIcon, GitHubPullRequest, isPullRequest } from '@devhub/core'
import * as colors from '../../../styles/colors'

export function getCommitIconAndColor(): { icon: GitHubIcon; color?: string } {
  return { icon: 'git-commit', color: colors.orange }
}

export function getReleaseIconAndColor(): { icon: GitHubIcon; color?: string } {
  return { icon: 'tag', color: colors.pink }
}

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
