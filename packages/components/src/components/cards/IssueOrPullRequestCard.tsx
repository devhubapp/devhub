import React from 'react'

import { EnhancedGitHubIssueOrPullRequest } from '@devhub/core'
import { CardWithLink } from './CardWithLink'

export interface IssueOrPullRequestCardProps {
  columnId: string
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const { columnId, issueOrPullRequest, ownerIsKnown, repoIsKnown } = props

    return (
      <CardWithLink
        type="issue_or_pr"
        repoIsKnown={repoIsKnown}
        ownerIsKnown={ownerIsKnown}
        item={issueOrPullRequest}
        columnId={columnId}
      />
    )
  },
)

IssueOrPullRequestCard.displayName = 'IssueOrPullRequestCard'
