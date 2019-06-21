import _ from 'lodash'
import React from 'react'

import {
  getOwnerAndRepo,
  getRepoFullNameFromObject,
  GitHubRepo,
} from '@devhub/core'
import { RepositoryRow, RepositoryRowProps } from './RepositoryRow'
import { RenderItem, RowList, RowListProps, rowListProps } from './RowList'

interface ListProps extends Omit<RowListProps<GitHubRepo>, 'renderItem'> {}
interface ItemProps
  extends Omit<RepositoryRowProps, 'ownerName' | 'repositoryName'> {}

export interface RepositoryListRowProps extends ListProps, ItemProps {}

export const RepositoryListRow = React.memo(
  (_props: RepositoryListRowProps) => {
    const listProps = _.pick(_props, rowListProps) as ListProps
    const itemProps = _.omit(_props, rowListProps) as ItemProps

    const renderItem: RenderItem<GitHubRepo> = ({ item: repo, index }) => {
      if (!(repo && repo.id)) return null

      const repoFullName = getRepoFullNameFromObject(repo)
      const { owner: repoOwnerName, repo: repoName } = getOwnerAndRepo(
        repoFullName,
      )

      if (!(repoOwnerName && repoName)) return null

      return (
        <RepositoryRow
          {...itemProps}
          key={`repo-row-${repo.id}`}
          ownerName={repoOwnerName!}
          repositoryName={repoName!}
          withTopMargin={index === 0 ? itemProps.withTopMargin : true}
        />
      )
    }

    return <RowList {...listProps} renderItem={renderItem} />
  },
)
