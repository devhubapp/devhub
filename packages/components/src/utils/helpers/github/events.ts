import _ from 'lodash'

import {
  EnhancedGitHubEvent,
  GitHubEventSubjectType,
  GitHubIcon,
  GitHubIssue,
  GitHubPullRequest,
  isPullRequest,
  isTagMainEvent,
  sortEvents,
} from '@devhub/core'
import { bugsnag } from '../../../libs/bugsnag'
import * as colors from '../../../styles/colors'
import {
  getCommitIconAndColor,
  getIssueIconAndColor,
  getPullRequestIconAndColor,
  getReleaseIconAndColor,
  getTagIconAndColor,
} from './shared'

export const eventSubjectTypes: GitHubEventSubjectType[] = [
  'Branch',
  'Commit',
  'Issue',
  'PullRequest',
  'PullRequestReview',
  'Release',
  'Repository',
  'Tag',
  'User',
  'Wiki',
]

export function getEventSubjectType(
  event: EnhancedGitHubEvent,
): GitHubEventSubjectType | null {
  if (!(event && event.type)) return null

  switch (event.type) {
    case 'CommitCommentEvent':
      return 'Commit'

    case 'CreateEvent':
    case 'DeleteEvent': {
      switch (event.payload.ref_type) {
        case 'repository':
          return 'Repository'
        case 'branch':
          return 'Branch'
        case 'tag':
          return 'Tag'
        default:
          return null
      }
    }

    case 'ForkEvent':
      return 'Repository'
    case 'GollumEvent':
      return 'Wiki'
    case 'IssueCommentEvent':
      return 'Issue'
    case 'IssuesEvent':
      return 'Issue'
    case 'MemberEvent':
      return 'User'
    case 'PublicEvent':
      return 'Repository'
    case 'PullRequestEvent':
      return 'PullRequest'
    case 'PullRequestReviewCommentEvent':
      return 'PullRequestReview'
    case 'PullRequestReviewEvent':
      return 'PullRequestReview'
    case 'PushEvent':
      return 'Commit'
    case 'ReleaseEvent':
      return 'Release'
    case 'WatchEvent':
    case 'WatchEvent:OneUserMultipleRepos':
      return 'Repository'

    default:
      return null
  }
}

export function getEventIconAndColor(
  event: EnhancedGitHubEvent,
): { color?: string; icon: GitHubIcon; subIcon?: GitHubIcon } {
  switch (event.type) {
    case 'CommitCommentEvent':
      return {
        ...getCommitIconAndColor(),
        subIcon: 'comment-discussion',
      }

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
          ? getPullRequestIconAndColor(event.payload.issue as GitHubPullRequest)
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
            draft: pullRequest.draft,
            state: 'open',
            merged: false,
            merged_at: undefined,
            mergeable_state: pullRequest.mergeable_state,
          })
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
      return isTagMainEvent(event)
        ? getTagIconAndColor()
        : getReleaseIconAndColor()

    case 'WatchEvent':
    case 'WatchEvent:OneUserMultipleRepos':
      return { icon: 'star', color: colors.star }

    default: {
      const message = `Unknown event type: ${(event as any).type}`
      bugsnag.notify(new Error(message))
      console.error(message)
      return { icon: 'mark-github' }
    }
  }
}

export function mergeEventsPreservingEnhancement(
  newItems: EnhancedGitHubEvent[],
  prevItems: EnhancedGitHubEvent[],
) {
  return sortEvents(
    _.uniqBy(_.concat(newItems, prevItems), 'id').map(item => {
      const newItem = newItems.find(i => i.id === item.id)
      const existingItem = prevItems.find(i => i.id === item.id)
      if (!(newItem && existingItem)) return item

      const mergedItem = {
        forceUnreadLocally: existingItem.forceUnreadLocally,
        last_read_at: existingItem.last_read_at,
        last_unread_at: existingItem.last_unread_at,
        saved: existingItem.saved,
        unread: existingItem.unread,
        ...newItem,
      }

      return _.isEqual(mergedItem, existingItem) ? existingItem : mergedItem
    }),
  )
}
