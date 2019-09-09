import React, { useMemo } from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  IssueOrPullRequestCardsContainer,
  IssueOrPullRequestCardsContainerProps,
} from '../../containers/IssueOrPullRequestCardsContainer'
import { ColumnRenderer, ColumnRendererProps } from './ColumnRenderer'

export interface IssueOrPullRequestColumnProps
  extends Omit<
    IssueOrPullRequestCardsContainerProps,
    'ownerIsKnown' | 'repoIsKnown'
  > {
  columnId: string
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const IssueOrPullRequestColumn = React.memo(
  (props: IssueOrPullRequestColumnProps) => {
    const {
      columnId,
      columnIndex,
      headerDetails,
      pagingEnabled,
      pointerEvents,
      swipeable,
    } = props

    const Children = useMemo<ColumnRendererProps['children']>(
      () => (
        <IssueOrPullRequestCardsContainer
          key={`issue-or-pr-cards-container-${columnId}`}
          columnId={columnId}
          columnIndex={columnIndex}
          ownerIsKnown={!!(headerDetails && headerDetails.ownerIsKnown)}
          pointerEvents={pointerEvents}
          repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
          swipeable={swipeable}
        />
      ),
      [
        columnId,
        pointerEvents,
        swipeable,
        headerDetails && headerDetails.ownerIsKnown,
        headerDetails && headerDetails.repoIsKnown,
      ],
    )

    if (!headerDetails) return null

    return (
      <ColumnRenderer
        key={`issue-or-pr-column-${columnId}-inner`}
        avatarImageURL={
          headerDetails.avatarProps && headerDetails.avatarProps.imageURL
        }
        avatarLinkURL={
          headerDetails.avatarProps && headerDetails.avatarProps.linkURL
        }
        columnId={columnId}
        columnIndex={columnIndex}
        columnType="issue_or_pr"
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        {Children}
      </ColumnRenderer>
    )
  },
)

IssueOrPullRequestColumn.displayName = 'IssueOrPullRequestColumn'
