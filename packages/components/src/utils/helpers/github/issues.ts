import _ from 'lodash'

import {
  EnhancedGitHubIssueOrPullRequest,
  GitHubIssue,
  GitHubIssueOrPullRequest,
  GitHubIssueOrPullRequestSubjectType,
  GitHubPullRequest,
  sortIssuesOrPullRequests,
} from '@devhub/core'
import { getIssueIconAndColor, getPullRequestIconAndColor } from './shared'

export const issueOrPullRequestSubjectTypes: GitHubIssueOrPullRequestSubjectType[] = [
  'Issue',
  'PullRequest',
]

export function getIssueOrPullRequestIconAndColor(
  type: GitHubIssueOrPullRequestSubjectType,
  issueOrPullRequest: GitHubIssueOrPullRequest,
) {
  return type === 'PullRequest'
    ? getPullRequestIconAndColor(issueOrPullRequest as GitHubPullRequest)
    : getIssueIconAndColor(issueOrPullRequest as GitHubIssue)
}

export function mergeIssuesOrPullRequestsPreservingEnhancement(
  newItems: EnhancedGitHubIssueOrPullRequest[],
  prevItems: EnhancedGitHubIssueOrPullRequest[],
) {
  return sortIssuesOrPullRequests(
    _.uniqBy(_.concat(newItems || [], prevItems || []), 'id').map(item => {
      const newItem = (newItems || []).find(i => i.id === item.id)
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
