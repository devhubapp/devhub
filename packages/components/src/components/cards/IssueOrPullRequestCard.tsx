import React from 'react'

import { CardWithLink } from './CardWithLink'

export interface IssueOrPullRequestCardProps {
  columnId: string
  nodeIdOrId: string
  ownerIsKnown: boolean
  repoIsKnown: boolean
}

export const IssueOrPullRequestCard = React.memo(
  (props: IssueOrPullRequestCardProps) => {
    const { columnId, nodeIdOrId, ownerIsKnown, repoIsKnown } = props

    return (
      <CardWithLink
        type="issue_or_pr"
        repoIsKnown={repoIsKnown}
        ownerIsKnown={ownerIsKnown}
        nodeIdOrId={nodeIdOrId}
        columnId={columnId}
      />
    )
  },
)

IssueOrPullRequestCard.displayName = 'IssueOrPullRequestCard'
