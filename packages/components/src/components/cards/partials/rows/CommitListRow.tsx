import _ from 'lodash'
import React from 'react'

import { GitHubPushedCommit } from '@devhub/core'
import { CommitRow, CommitRowProps } from './CommitRow'
import { RenderItem, RowList, RowListProps, rowListProps } from './RowList'

interface ListProps
  extends Omit<RowListProps<GitHubPushedCommit>, 'renderItem'> {}
interface ItemProps
  extends Omit<
    CommitRowProps,
    'authorEmail' | 'authorName' | 'isCommitMainSubject' | 'message' | 'url'
  > {}

export interface CommitListRowProps extends ListProps, ItemProps {}

export const CommitListRow = React.memo((_props: CommitListRowProps) => {
  const listProps = _.pick(_props, rowListProps) as ListProps
  const itemProps = _.omit(_props, rowListProps) as ItemProps

  const renderItem: RenderItem<GitHubPushedCommit> = ({
    index,
    item: commit,
  }) => {
    if (!(commit && commit.sha && commit.message)) return null

    return (
      <CommitRow
        key={`commit-row-${commit.sha}`}
        {...itemProps}
        authorEmail={commit.author.email}
        authorName={commit.author.name}
        isCommitMainSubject={!!listProps.data && listProps.data.length === 1}
        message={commit.message}
        url={commit.url}
        withTopMargin={index === 0 ? !!itemProps.withTopMargin : true}
      />
    )
  }

  return <RowList {...listProps} renderItem={renderItem} />
})
