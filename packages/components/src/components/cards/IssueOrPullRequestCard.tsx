import React from 'react'

import { EnhancedGitHubIssueOrPullRequest } from '@devhub/core'
import { BaseCardProps } from './BaseCard.shared'
import { CardWithLink } from './CardWithLink'

export interface IssueOrPullRequestCardProps {
  cachedCardProps?: BaseCardProps | undefined
  columnId: string
  issueOrPullRequest: EnhancedGitHubIssueOrPullRequest
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const {
      cachedCardProps,
      columnId,
      issueOrPullRequest,
      ownerIsKnown,
      repoIsKnown,
    } = props

    return (
      <CardWithLink
        type="issue_or_pr"
        repoIsKnown={repoIsKnown}
        ownerIsKnown={ownerIsKnown}
        item={issueOrPullRequest}
        columnId={columnId}
        cachedCardProps={cachedCardProps}
      />
    )
  },
)

IssueOrPullRequestCard.displayName = 'IssueOrPullRequestCard'
