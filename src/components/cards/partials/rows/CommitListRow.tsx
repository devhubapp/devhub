import React, { PureComponent } from 'react'

import CommitRow from './CommitRow'
import RowList, { RenderItem } from './RowList'

import { IGitHubCommit } from '../../../../types'

export interface CommitListRowProps {
  isRead: boolean
  maxHeight?: number
  commits: IGitHubCommit[]
}

export default class CommitListRow extends PureComponent<CommitListRowProps> {
  renderItem: RenderItem<IGitHubCommit> = ({
    showMoreItemsIndicator,
    item: commit,
  }) => {
    if (!(commit && commit.sha && commit.message)) return null

    return (
      <CommitRow
        key={`commit-row-${commit.sha}`}
        {...this.props}
        authorEmail={commit.author.email}
        authorName={commit.author.name}
        message={commit.message}
        showMoreItemsIndicator={showMoreItemsIndicator}
        url={commit.url}
      />
    )
  }

  render() {
    const { commits, ...props } = this.props

    if (!(commits && commits.length > 0)) return null

    return <RowList {...props} data={commits} renderItem={this.renderItem} />
  }
}
