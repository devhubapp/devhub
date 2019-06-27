import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  IssueOrPullRequestCardsContainer,
  IssueOrPullRequestCardsContainerProps,
} from '../../containers/IssueOrPullRequestCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface IssueOrPullRequestColumnProps
  extends Omit<
    IssueOrPullRequestCardsContainerProps,
    'cardViewMode' | 'disableItemFocus' | 'enableCompactLabels' | 'repoIsKnown'
  > {
  columnIndex: number
  disableColumnOptions?: boolean
  headerDetails: ReturnType<typeof getColumnHeaderDetails>
  pagingEnabled?: boolean
}

export const IssueOrPullRequestColumn = React.memo(
  (props: IssueOrPullRequestColumnProps) => {
    const {
      column,
      columnIndex,
      disableColumnOptions,
      headerDetails,
      pagingEnabled,
    } = props

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
        disableColumnOptions={disableColumnOptions}
        icon={headerDetails.icon}
        owner={headerDetails.owner}
        pagingEnabled={pagingEnabled}
        repo={headerDetails.repo}
        repoIsKnown={headerDetails.repoIsKnown}
        subtitle={headerDetails.subtitle}
        title={headerDetails.title}
      >
        {({ cardViewMode, disableItemFocus, enableCompactLabels }) => (
          <IssueOrPullRequestCardsContainer
            {...props}
            key={`issue-or-pr-cards-container-${column.id}`}
            cardViewMode={cardViewMode}
            columnIndex={columnIndex}
            disableItemFocus={disableItemFocus}
            enableCompactLabels={enableCompactLabels}
            repoIsKnown={headerDetails.repoIsKnown}
          />
        )}
      </ColumnRenderer>
    )
  },
)

IssueOrPullRequestColumn.displayName = 'IssueOrPullRequestColumn'
