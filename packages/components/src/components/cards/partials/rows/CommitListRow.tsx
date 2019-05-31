import React from 'react'

import { GitHubPushedCommit } from '@devhub/core'
import { CommitRow, CommitRowProps } from './CommitRow'
import { RenderItem, RowList } from './RowList'

export interface CommitListRowProps
  extends Omit<
    CommitRowProps,
    'authorEmail' | 'authorName' | 'message' | 'showMoreItemsIndicator' | 'url'
  > {
  commits: GitHubPushedCommit[]
  maxHeight?: number
}

export const CommitListRow = React.memo((props: CommitListRowProps) => {
  const renderItem: RenderItem<GitHubPushedCommit> = ({
    showMoreItemsIndicator,
    index,
    item: commit,
  }) => {
    if (!(commit && commit.sha && commit.message)) return null

    return (
      <CommitRow
        key={`commit-row-${commit.sha}`}
        {...props}
        authorEmail={commit.author.email}
        authorName={commit.author.name}
        message={commit.message}
        showMoreItemsIndicator={showMoreItemsIndicator}
        url={commit.url}
        withTopMargin={index === 0 ? props.withTopMargin : true}
      />
    )
  }

  const { commits, ...otherProps } = props

  if (!(commits && commits.length > 0)) return null

  return <RowList {...otherProps} data={commits} renderItem={renderItem} />
})
