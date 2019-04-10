import React from 'react'

import { getColumnHeaderDetails } from '@devhub/core'
import {
  IssueOrPullRequestCardsContainer,
  IssueOrPullRequestCardsContainerProps,
} from '../../containers/IssueOrPullRequestCardsContainer'
import { ColumnRenderer } from './ColumnRenderer'

export interface IssueOrPullRequestColumnProps
  extends IssueOrPullRequestCardsContainerProps {
  columnIndex: number
  disableColumnOptions?: boolean
  pagingEnabled?: boolean
}

export const IssueOrPullRequestColumn = React.memo(
  (props: IssueOrPullRequestColumnProps) => {
    const {
      column,
      columnIndex,
      disableColumnOptions,
      pagingEnabled,
      subscriptions,
    } = props

    const requestTypeIconAndData = getColumnHeaderDetails(column, subscriptions)

    return (
      <ColumnRenderer
        key={`issue-or-pr-column-${column.id}-inner`}
        column={column}
        columnIndex={columnIndex}
        disableColumnOptions={disableColumnOptions}
        owner={requestTypeIconAndData.owner}
        pagingEnabled={pagingEnabled}
        repo={requestTypeIconAndData.repo}
        repoIsKnown={requestTypeIconAndData.repoIsKnown}
        subscriptions={subscriptions}
      >
        <IssueOrPullRequestCardsContainer
          key={`issue-or-pr-cards-container-${column.id}`}
          repoIsKnown={requestTypeIconAndData.repoIsKnown}
          {...props}
          columnIndex={columnIndex}
        />
      </ColumnRenderer>
    )
  },
)
