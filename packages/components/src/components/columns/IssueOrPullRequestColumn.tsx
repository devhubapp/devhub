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
  columnIndex: number
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const IssueOrPullRequestColumn = React.memo(
  (props: IssueOrPullRequestColumnProps) => {
    const {
      column,
      columnIndex,
      headerDetails,
      pagingEnabled,
      pointerEvents,
      swipeable,
    } = props

    const Children = useMemo<ColumnRendererProps['children']>(
      () => (
        <IssueOrPullRequestCardsContainer
          key={`issue-or-pr-cards-container-${column.id}`}
          column={column}
          columnIndex={columnIndex}
          ownerIsKnown={!!(headerDetails && headerDetails.ownerIsKnown)}
          pointerEvents={pointerEvents}
          repoIsKnown={!!(headerDetails && headerDetails.repoIsKnown)}
          swipeable={swipeable}
        />
      ),
      [
        column,
        pointerEvents,
        swipeable,
        headerDetails && headerDetails.ownerIsKnown,
        headerDetails && headerDetails.repoIsKnown,
      ],
    )

    if (!headerDetails) return null

    return (
      <ColumnRenderer
        key={`issue-or-pr-column-${column.id}-inner`}
        avatarRepo={headerDetails.avatarProps && headerDetails.avatarProps.repo}
        avatarUsername={
          headerDetails.avatarProps && headerDetails.avatarProps.username
        }
        column={column}
        columnIndex={columnIndex}
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
