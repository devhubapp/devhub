import _ from 'lodash'

import {
  GitHubEventSubjectType,
  GitHubIcon,
  GitHubNotificationSubjectType,
  GitHubPullRequest,
  GitHubStateType,
  isDraft,
  isPullRequest,
  ThemeColors,
} from '@devhub/core'

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
  return { icon: 'git-commit', color: 'brown', tooltip: 'Commit' }
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

export function getSubjectTypeMetadata<
  T extends GitHubEventSubjectType | GitHubNotificationSubjectType
>(
  subjectType: T,
): {
  color?: keyof ThemeColors
  label: string
  subjectType: T
} {
  switch (
    subjectType as GitHubEventSubjectType | GitHubNotificationSubjectType
  ) {
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
