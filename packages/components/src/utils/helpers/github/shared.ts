import _ from 'lodash'

import {
  GitHubEventSubjectType,
  GitHubIcon,
  GitHubNotificationSubjectType,
  GitHubPullRequest,
  isDraft,
  isPullRequest,
  StaticThemeColors,
} from '@devhub/core'
// import * as colors from '../../../styles/colors'

export function getCommitIconAndColor(
  colors: StaticThemeColors,
): {
  icon: GitHubIcon
  color?: string
  tooltip: string
} {
  return { icon: 'git-commit', color: colors.brown, tooltip: 'Commit' }
}

export function getReleaseIconAndColor(
  colors: StaticThemeColors,
): {
  icon: GitHubIcon
  color?: string
  tooltip: string
} {
  return {
    icon: 'rocket',
    color: colors.pink,
    tooltip: 'Release',
  }
}

export function getTagIconAndColor(
  colors: StaticThemeColors,
): {
  icon: GitHubIcon
  color?: string
  tooltip: string
} {
  return {
    icon: 'tag',
    color: colors.gray,
    tooltip: 'Tag',
  }
}

export function getPullRequestIconAndColor(
  pullRequest: {
    draft: GitHubPullRequest['draft']
    state: GitHubPullRequest['state']
    merged: GitHubPullRequest['merged'] | undefined
    merged_at: GitHubPullRequest['merged_at'] | undefined
    mergeable_state: GitHubPullRequest['mergeable_state'] | undefined
  },
  colors: StaticThemeColors,
): { icon: GitHubIcon; color?: string; tooltip: string } {
  const draft = isDraft(pullRequest)
  const merged = !!(pullRequest.merged || pullRequest.merged_at)
  const state = merged ? 'merged' : pullRequest.state

  switch (state) {
    case 'open':
      return {
        icon: 'git-pull-request',
        color: draft ? colors.gray : colors.green,
        tooltip: `Open${draft ? ' draft' : ''} pull request`,
      }

    case 'closed':
      return {
        icon: 'git-pull-request',
        color: colors.lightRed,
        tooltip: `Closed${draft ? ' draft' : ''} pull request`,
      }

    case 'merged':
      return {
        icon: 'git-merge',
        color: colors.purple,
        tooltip: `Merged pull request`,
      }

    default:
      return {
        icon: 'git-pull-request',
        tooltip: 'Pull Request',
      }
  }
}

export function getIssueIconAndColor(
  issue: {
    state?: GitHubPullRequest['state']
    merged_at?: GitHubPullRequest['merged_at']
  },
  colors: StaticThemeColors,
): { icon: GitHubIcon; color?: string; tooltip: string } {
  const { state } = issue

  if (isPullRequest(issue)) {
    return getPullRequestIconAndColor(issue as GitHubPullRequest, colors)
  }

  switch (state) {
    case 'open':
      return {
        icon: 'issue-opened',
        color: colors.green,
        tooltip: `Open issue`,
      }

    case 'closed':
      return {
        icon: 'issue-closed',
        color: colors.lightRed,
        tooltip: 'Closed issue',
      }

    default:
      return { icon: 'issue-opened', tooltip: 'Issue' }
  }
}

export function getSubjectTypeMetadata<
  T extends GitHubEventSubjectType | GitHubNotificationSubjectType
>(
  subjectType: T,
): {
  color?: string
  label: string
  subjectType: T
} {
  switch (subjectType) {
    case 'PullRequestReview': {
      return {
        label: 'Review',
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
        label: 'Security Alert',
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
