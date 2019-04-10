import _ from 'lodash'

import { EnhancedGitHubIssueOrPullRequest } from '../../types'

export function getOlderIssueOrPullRequestDate(
  events: EnhancedGitHubIssueOrPullRequest[],
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
) {
  const olderItem = sortIssuesOrPullRequests(events, field, 'desc').pop()
  return olderItem && olderItem[field]
}

export function sortIssuesOrPullRequests(
  events: EnhancedGitHubIssueOrPullRequest[] | undefined,
  field: keyof EnhancedGitHubIssueOrPullRequest = 'updated_at',
  order: 'asc' | 'desc' = 'desc',
) {
  if (!events) return []
  return _(events)
    .uniqBy('id')
    .orderBy(field, order)
    .value()
}
