import React from 'react'

import { GitHubRepo } from '@devhub/core/src/types'
import { getOwnerAndRepo } from '@devhub/core/src/utils/helpers/github/shared'
import { getRepoFullNameFromObject } from '@devhub/core/src/utils/helpers/github/url'
import { RepositoryRow } from './RepositoryRow'
import { RenderItem, RowList } from './RowList'

export interface RepositoryListRowProps {
  isForcePush?: boolean
  isFork?: boolean
  isPush?: boolean
  isRead: boolean
  maxHeight?: number
  repos: GitHubRepo[]
}

export const RepositoryListRow = React.memo((props: RepositoryListRowProps) => {
  const renderItem: RenderItem<GitHubRepo> = ({
    item: repo,
    showMoreItemsIndicator,
  }) => {
    if (!(repo && repo.id)) return null

    const repoFullName = getRepoFullNameFromObject(repo)
    const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
      repoFullName,
    )

    if (!(repoOwnerName && repoName)) return null

    return (
      <RepositoryRow
        key={`repo-row-${repo.id}`}
        {...props}
        ownerName={repoOwnerName!}
        repositoryName={repoName!}
        showMoreItemsIndicator={showMoreItemsIndicator}
      />
    )
  }

  const { repos, ...otherProps } = props

  if (!(repos && repos.length > 0)) return null

  return <RowList {...otherProps} data={repos} renderItem={renderItem} />
})
