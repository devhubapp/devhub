import {
  EnhancedGitHubEvent,
  GitHubIcon,
  GitHubIssue,
  GitHubPullRequest,
} from '@devhub/core/dist/types'
import { isPullRequest } from '@devhub/core/dist/utils/helpers/github/shared'
import * as colors from '../../../styles/colors'
import { getIssueIconAndColor, getPullRequestIconAndColor } from './shared'

export function getEventIconAndColor(
  event: EnhancedGitHubEvent,
): { color?: string; icon: GitHubIcon; subIcon?: GitHubIcon } {
  switch (event.type) {
    case 'CommitCommentEvent':
      return { icon: 'git-commit', subIcon: 'comment-discussion' }

    case 'CreateEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo' }
        case 'branch':
          return { icon: 'git-branch' }
        case 'tag':
          return { icon: 'tag' }
        default:
          return { icon: 'plus' }
      }
    }

    case 'DeleteEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return { icon: 'repo', color: colors.red }
        case 'branch':
          return { icon: 'git-branch', color: colors.red }
        case 'tag':
          return { icon: 'tag', color: colors.red }
        default:
          return { icon: 'trashcan' }
      }
    }

    case 'ForkEvent':
      return { icon: 'repo-forked' }

    case 'GollumEvent':
      return { icon: 'book' }

    case 'IssueCommentEvent': {
      return {
        ...(isPullRequest(event.payload.issue)
          ? getPullRequestIconAndColor(event.payload.issue)
          : getIssueIconAndColor(event.payload.issue)),
        subIcon: 'comment-discussion',
      }
    }

    case 'IssuesEvent': {
      const issue = event.payload.issue

      switch (event.payload.action) {
        case 'opened':
          return getIssueIconAndColor({ state: 'open' } as GitHubIssue)
        case 'closed':
          return getIssueIconAndColor({ state: 'closed' } as GitHubIssue)

        case 'reopened':
          return {
            ...getIssueIconAndColor({ state: 'open' } as GitHubIssue),
            icon: 'issue-reopened',
          }
        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        // case 'milestoned':
        // case 'demilestoned':
        default:
          return getIssueIconAndColor(issue)
      }
    }
    case 'MemberEvent':
      return { icon: 'person' }

    case 'PublicEvent':
      return { icon: 'globe', color: colors.blue }

    case 'PullRequestEvent': {
      const pullRequest = event.payload.pull_request

      switch (event.payload.action) {
        case 'opened':
        case 'reopened':
          return getPullRequestIconAndColor({
            state: 'open',
          } as GitHubPullRequest)
        // case 'closed': return getPullRequestIconAndColor({ state: 'closed' } as GitHubPullRequest);

        // case 'assigned':
        // case 'unassigned':
        // case 'labeled':
        // case 'unlabeled':
        // case 'edited':
        default:
          return getPullRequestIconAndColor(pullRequest)
      }
    }

    case 'PullRequestReviewCommentEvent':
    case 'PullRequestReviewEvent': {
      return {
        ...getPullRequestIconAndColor(event.payload.pull_request),
        subIcon: 'comment-discussion',
      }
    }

    case 'PushEvent':
      return { icon: 'code' }

    case 'ReleaseEvent':
      return { icon: 'tag' }

    case 'WatchEvent':
    case 'WatchEvent:OneUserMultipleRepos':
      return { icon: 'star', color: colors.star }

    default: {
      console.error(`Unknown event type: ${(event as any).type}`)
      return { icon: 'mark-github' }
    }
  }
}
